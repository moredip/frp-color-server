window.Mumber = window.Mumber || {};

Mumber.renderMumberLine = function renderMumberLine(mumbers){
  var FULL_WIDTH=400;

  var lines = mumbers.map(function(mumber,ix){
    var x = ""+(400*mumber)+"px";
    return <line key={ix} className="social-numbers__mumber-marker" x1={x} y1="5" x2={x} y2="35"></line>
  });

  return (
    <section className="social-numbers">
      <h1>Mumber line</h1>
      <svg width={""+FULL_WIDTH+"px"} height="100px">
        <g tranform="translate(0,10)">
          <line className="social-numbers__number-line" x1="0" y1="20" x2="100%" y2="20"></line>
          {lines}
        </g>
      </svg>
    </section>
  );
}
