var sys = require("sys")

var rand = function(max) {
  return Math.floor(Math.random() * max)
}

var think = function (callback) {
  setTimeout(callback, rand(100))
}

var x = 0
var a = 0
for (var i = 0; i < 3; i++) {
  think(function () {
    ++a;
    var b = 0;
    for (var j = 0; j < 3; j++) {
      think(function () {
        ++b
        sys.debug([++x, a, b])
      })
    }
  })
}
