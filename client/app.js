(function(){

function pickRandomColor(){
  return tinycolor({
    h: Math.random() * 360,
    s: 0.6,
    l: 0.6
  });
};

console.log('connecting');
var socket = io.connect();

socket.on('pong', function (data) {
  console.log('GOT A PONG!',data);
});

console.log('sending a ping');
socket.emit('ping','OH HAI');

var randomColors = Rx.Observable.interval(2000)
  .map( pickRandomColor );

randomColors
    .map( function(color){ return color.toString("rgb"); } )
    .subscribe( function(color){
      console.log('emitting',color);
      socket.emit('ping', 'A COLOR! ' + color);
    });

//var publishStreamToPubnub = function(stream,channelName){
  //stream.onValue( function(value){
    //pubnubClient.publish({
      //channel: channelName,
      //message: value 
    //});
   //});
//}

//$( function(){
  //var changeColorClicks = $("#change-color").asEventStream('click'),
      //sendColorClicks = $("#send-color").asEventStream('click');

  //var randomColors = changeColorClicks
    //.map( pickRandomColor )
    //.toProperty( pickRandomColor() );

  //randomColors.assign( $("body"), "css", "background-color" )

  //var colorMessages = randomColors
    //.sampledBy(sendColorClicks)
    //.map( function(color){ return color.toString("rgb"); } )
    //.log();

  //publishStreamToPubnub(colorMessages,PUBNUB_CHANNEL);
//});

}());
