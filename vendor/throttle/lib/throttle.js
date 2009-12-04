exports.create = function (count) {
  var deferred = [];
  var running = 0;
  return {
    run: function(callback) {
      if(running < count) {
        running++;
        callback();
      } else {
        deferred.push(callback)
      }
    },
    free: function() {
      running--;
      if(deferred.length) {
        deferred.shift()()
      }
    }
  };
};
