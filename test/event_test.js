var sys = require("sys")

var think = function (callback) {
  setTimeout(callback, Math.floor(Math.random() * 100))
}

var y = 0, z = Math.floor(Math.random() * 10) + 10;

for (var i = 0; i < z; i++) {
  think(function () {
    var xx = (++y == z)

    var a = 0, b = 0, c = Math.floor(Math.random() * 10) + 10;
    for (var j = 0; j < c; j++) {
      think(function () {
        var yy = (++b == c)
        sys.debug([y, b])
        if (xx && yy) {
          sys.debug("eof: " + y + " " + b)
        }
      })
    }
  })
}
