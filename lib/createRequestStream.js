const Rx = require('rxjs/Rx');

const observableForWriteableStream = require('./observableForWritableStream');

module.exports = createRequestStream;

function createRequestStream(expressApp){
  const requests$ = new Rx.Subject(); 
  expressApp.use(function(req,res,next){
    const responder = observableForWriteableStream(res);
    requests$.next({ req:req,responder:responder });
  });
  return requests$;
}
