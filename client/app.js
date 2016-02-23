(function(){
  function renderMumbers(mumbers){
    ReactDOM.render(
      Mumber.renderMumberLine(mumbers),
      document.getElementById('mumber-line-container')
    );
  }

  renderMumbers([]);

  //var socket = io();

  //var numbers$ = Rx.Observable.fromEventPattern(
      //function add(handler){
        //socket.on('numbers',handler);
      //},

  //socket.on('numbers', function(numbers){
    //console.log('numbers!',numbers);
  //});



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
    .map( parseFloat );

  numbers.subscribe( function(n){ renderMumbers([n]); } );

  var percentages = numbers.map( function(v){ return Math.round(1000*v); } )
  percentages.subscribe( function(n){ $label.text(n) } );

  numbers.subscribe( function(n){ renderMumbers([n]); } );

  percentages
    .throttleTime(POST_THROTTLE_IN_MS)
    .subscribe( function(n){ $.post('/sendNumber',{number:n}) } );
}());
