const Url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);

const createRequestStream = require('./lib/createRequestStream');


app.get('/',function(req,res){
  res.redirect("/client");
});
app.use('/client',express.static('client'));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const requests$ = createRequestStream(app);

requests$.subscribe( e => console.log( e.req.method, 'request to', e.req.url ) );

const sendNumberReqs = requests$.filter(function(e){
  const requestUrl = Url.parse(e.req.url);
  return e.req.method === 'POST' && requestUrl.pathname === "/sendNumber";
});

const numbers = sendNumberReqs.map( function(e){
  return {
    number: e.req.body.number,
    sender: e.req.body.sender,
    responder: e.responder
  };
});

numbers.subscribe( function(o){
  console.log(`got ${o.number} from ${o.sender}`);
  o.responder.next('GOT IT!');
  o.responder.complete();
});

const port = (process.argv[2] || 8000);
server.listen(port, undefined, function(){
  console.log(`\nserver running @ http://localhost:${port}/\n\n`);
});
