window.Mumber = window.Mumber || {};

Mumber.renderMumberLine = function renderMumberLine(mumbers) {
  var FULL_WIDTH = 400;

  var lines = mumbers.map(function (mumber, ix) {
    var x = "" + 400 * mumber + "px";
    return React.createElement("line", { key: ix, className: "social-numbers__mumber-marker", x1: x, y1: "5", x2: x, y2: "35" });
  });

  return React.createElement(
    "section",
    { className: "social-numbers" },
    React.createElement(
      "h1",
      null,
      "Mumber line"
    ),
    React.createElement(
      "svg",
      { width: "" + FULL_WIDTH + "px", height: "100px" },
      React.createElement(
        "g",
        { tranform: "translate(0,10)" },
        React.createElement("line", { className: "social-numbers__number-line", x1: "0", y1: "20", x2: "100%", y2: "20" }),
        lines
      )
    )
  );
};
