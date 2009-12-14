var sys = require("sys")

var rand = function(max) {
  return Math.floor(Math.random() * max)
}

var think = function (callback) {
  setTimeout(callback, rand(100))
}

var y = 0, z = rand(10) + 10;

for (var i = 0; i < z; i++) {
  think(function () {
    var xx = (++y == z) // xx obliczane w momencie wykonania

    var b = 0, c = rand(10) + 10;
    for (var j = 0; j < c; j++) {
      think(function () {
        var yy = (++b == c) // yy obliczane w momencie wykonania

        if (xx && yy) {
          sys.debug("eof: " + y + " " + b)
        } else {
          sys.debug("...:" + y + " " + b)
        }
      })
    }
  })
}
