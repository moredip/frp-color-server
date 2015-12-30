var express = require('express');
var app = express();

var Rx = require('rx'); 
var RxNode = require('rx-node'); 

app.get('/', function(req,res) {
  var source = Rx.Observable.of("Hello World");
  RxNode.writeToStream(source,res,'utf8');
});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
app.listen(port);
