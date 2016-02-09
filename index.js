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

function returnChannelFor(eventEmitter,eventName){
  return function(e){
    eventEmitter.emit(eventName,e);
  }
}

var rets = [];
socketConnections.subscribe(function(socket){
  var ret = returnChannelFor(socket,'pong');
  rets.push(ret);
});

var pings = socketConnections.flatMap(function(socket){
  var ret = returnChannelFor(socket,'pong');

  var pingStream = observableFromSocket(socket,'ping');
  return pingStream.map(function(data){
    return {
      data: data,
      ret: ret
    };
  });
});

pings.subscribe( function(payload){
  var response = (payload.data.toUpperCase());
  rets.forEach( function(ret){
    ret(response);
  });
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
