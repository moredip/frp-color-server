(function(){
  var POST_THROTTLE_IN_MS = 200;

  if( !Cookies.get('CLIENT_UID') ){
    Cookies.set('CLIENT_UID',uuid(),{ expires: Infinity });
  }

  var $slider = $('.slider input'),
        $label = $('.slider .label');

  function valueFromEvent(e){
    return e.target.value;
  }

  var numbers = Rx.Observable.fromEvent($slider,'input',valueFromEvent)
    .startWith($slider.val())
    .map( parseFloat )
    .map( function(v){ return Math.round(1000*v); } )

  numbers.subscribe( function(n){ $label.text(n) } );

  numbers
    .throttleTime(POST_THROTTLE_IN_MS)
    .subscribe( function(n){ $.post('/sendNumber',{number:n}) } );
}());
