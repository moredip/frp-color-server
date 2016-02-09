const Rx = require('rxjs/Rx');

module.exports = observableForWriteableStream;

function bindObservableToStream(observable,stream,encoding){
  // this implementation based on https://github.com/Reactive-Extensions/rx-node/blob/735c31bcf5e335f5b65280184e97fd3afb330c68/index.js#L117
  return observable.subscribe({
      next(x){ stream.write(x,encoding); },
      error(err){ stream.emit('error',err); },
      complete(){ stream.end() }
  });
}

function observableForWriteableStream(stream,encoding){
  const subject = new Rx.Subject();
  bindObservableToStream(subject,stream,encoding);
  return subject;
}

