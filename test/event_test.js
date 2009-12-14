var sys = require("sys")

var rand = function(max) {
  return Math.floor(Math.random() * max)
}

var think = function (callback) {
  setTimeout(callback, rand(100))
}

var x = 0;
var y = 0;
for (var i = 0; i < rand(3) + 1; i++) {
  think(function () {
    for (var j = 0; j < rand(3) + 1; j++) {
      think(function () {
        sys.debug([++x, y])
      })
    }
    y += j;
  })
}
