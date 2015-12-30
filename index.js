var http = require('http');
var Rx = require('rx'); 
var RxNode = require('rx-node'); 

var server = http.createServer( function(req,res) {
  var source = Rx.Observable.of("Hello World");
  RxNode.writeToStream(source,res,'utf8');
});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);
