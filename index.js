var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Rx = require('rx'); 
var RxNode = require('rx-node'); 

app.get('/',function(req,res){
  res.redirect("/client");
});

app.use('/client',express.static('client'));

function observableFromSocketServer(socket){
  return Rx.Observable.fromEventPattern(function(handler){
    socket.on('connection', handler);
  });
}

function observableFromSocket(socket,eventName){
  return Rx.Observable.fromEventPattern(function(handler){
    socket.on(eventName, handler);
  });
}


function attachObservableToSocketObserver(eventName,observable,observer){
  observable.map(function(data){
    return {
      event: eventName,
      data: data
    };
  }).subscribe(observer);
}

var socketConnections = observableFromSocketServer(io);

function observerForEventEmitter(eventEmitter){
  function onNext(payload){
    eventEmitter.emit(payload.event,payload.data);
  }

  function onError(err){
    eventEmitter.emit('error',err); // TODO: is this a good convention?
    eventEmitter.removeAllListeners(); // TODO: is this legit?
  }

  function onComplete(){
    eventEmitter.emit('end'); // TODO: is this a good convention?
    eventEmitter.removeAllListeners(); // TODO: is this legit?
  }

  return Rx.Observer.create(onNext,onError,onComplete).checked();
}

socketConnections = socketConnections.tap(
  function (x)   { console.log('new socket!'); },
  function (err) { console.log('Socket Error:', err); },
  function ()    { console.log('Socket Completed'); }
);

//socketConnections.subscribe(function(socket){
  //socket.on('ping',function(p){
    //console.log('GOT A PING',p);
  //});
//});


var pings = socketConnections.flatMap(function(socket){
  var returnChannel = observerForEventEmitter(socket);

  var pingStream = observableFromSocket(socket,'ping');
  var pingStream = pingStream.tap(
    function (x)   { console.log('new ping!', x); },
    function (err) { console.log('Socket Error:', err); },
    function ()    { console.log('Socket Completed'); }
  );
  return pingStream.map(function(data){
    return {
      data: data,
      returnChannel: returnChannel
    };
  });
});

pings.subscribe( function(payload){
  console.log('got a ping',payload.data);
  console.log('sending a pong');
  var response = Rx.Observable.of('pong!');
  attachObservableToSocketObserver('pong',response,payload.returnChannel);
});

const roomRequests = new Rx.Subject(); 
app.get('/room/:roomName', function(req,res) {
  const responseObserver = new Rx.Subject();
  RxNode.writeToStream(responseObserver,res);
  roomRequests.onNext({
    roomName:req.params.roomName,
    responseObserver:responseObserver
  });
});

roomRequests.subscribe(function(msg){
  console.log('request for room:',msg.roomName);
});

roomRequests.subscribe(function(msg){
  var response = "welcome to room "+msg.roomName;
  var source = Rx.Observable.of(response);
  source.subscribe(msg.responseObserver);
});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);
