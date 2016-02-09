

(function(){
  if( !Cookies.get('CLIENT_UID') ){
    Cookies.set('CLIENT_UID',uuid(),{ expires: Infinity });
  }

  $.post('/sendNumber', {number:1003});
}());
