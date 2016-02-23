(function(){

  function myMumberUid(){
    var existingUid = Cookies.get('CLIENT_UID');
    if( existingUid ){
      return existingUid;
    }else{
      var newUid = uuid();
      Cookies.set('CLIENT_UID',newUid,{ expires: Infinity });
      return newUid;
    }
  }
  var MUMBER_UID = myMumberUid();

  function renderMumbers(mumbers){
    ReactDOM.render(
      Mumber.renderMumberLine(mumbers,MUMBER_UID),
      document.getElementById('mumber-line-container')
    );
  }

  function transformMumbersMapIntoArray(mumbersObj){
    var mumbersArray = [];
    for( mumberId in mumbersObj){
      var mumber = mumbersObj[mumberId]; 
      mumbersArray.push({
        id: mumberId,
        number: mumber.number
      });
    }
    return mumbersArray;
  }

  renderMumbers([]);

  var socket = io();

  var mumbers$ = Rx.Observable.fromEventPattern(
      function add(handler){
        socket.on('numbers',handler);
      }
  ).map(transformMumbersMapIntoArray);

  mumbers$.subscribe(function(numbers){
    console.log('numbers!',numbers);
  });

  mumbers$.subscribe( renderMumbers );

  var POST_THROTTLE_IN_MS = 200;

  var $slider = $('.slider input'),
        $label = $('.slider .label');

  function valueFromEvent(e){
    return e.target.value;
  }

  var numbers = Rx.Observable.fromEvent($slider,'input',valueFromEvent)
    .startWith($slider.val())
    .map( parseFloat );

  //numbers.subscribe( function(n){ renderMumbers([n]); } );

  var percentages = numbers.map( function(v){ return Math.round(1000*v); } )
  percentages.subscribe( function(n){ $label.text(n) } );

  numbers
    .throttleTime(POST_THROTTLE_IN_MS)
    .subscribe( function(n){ $.post('/sendNumber',{number:n}) } );
}());
