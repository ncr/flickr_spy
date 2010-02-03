/*
  Example:

  var t = throttle.create(3);
  var f = function () { setTimeout(function () { t.free(); }, 2000) };
  for(var i = 0; i < 10; i ++) {
    t.add(f);
  }

*/

exports.create = function (count) {
  var deferred = [];
  var running = 0;
  return {
    run: function (callback) {
      if(running < count) {
        running++;
        callback();
      } else {
        deferred.push(callback)
      }
    },
    free: function () {
      running--;
      if(deferred.length) {
        deferred.shift()()
      }
    }
  };
};
