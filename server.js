var sys = require("sys"), 
  http = require("http"),
  posix = require("posix"),
  flickr = require("./vendor/flickr/lib/flickr").flickr,
  underscore = require("./vendor/underscore/underscore"),
  throttle = require("./vendor/throttle/lib/throttle"),
  username = process.ARGV[2] || "ncr";

sys.puts("* Flickr Spy: " + username);

http.createServer(function (req, res) {
  if (req.uri.path == "/") {
    posix.cat("public/index.html").addCallback(function (data) {
      res.sendHeader(200, {'Content-Type': 'text/html'});
      res.sendBody(data);
      res.finish();
    });
  } else if (req.uri.path.match(/^\/activity/)) {
    res.sendHeader(200, {'Content-Type': 'text/plain'});
    spy("ncr").addListener("data", function(data){
      res.sendBody(JSON.stringify(data) + "\n");
    }).addListener("close", function(){
      res.finish();
    })
  } else {
    posix.cat("public/404.html").addCallback(function (data) {
      res.sendHeader(200, {'Content-Type': 'text/html'});
      res.sendBody(data);
      res.finish();
    });
  }
}).listen(8000);

var xxx = 0;
var spy = function (username) {
  var emitter = new process.EventEmitter();
  var url = "http://flickr.com/photos/" + username;
  flickr.rest.urls.lookupUser(url, function (user_id) {
    flickr.rest.contacts.getPublicList(user_id, function (user_ids) {
      sys.debug(xxx++)
      var contact_ids = user_ids;
      var t1 = throttle.create(3);
      var c1 = user_ids.length;
      user_ids.forEach(function (user_id, i1) {
        t1.run(function () {
          flickr.feeds.photosComments(user_id, function (photo_urls) {
            sys.debug(xxx++)
            var t2 = throttle.create(3);
            var c2 = photo_urls.length;
            photo_urls.forEach(function (photo_url, i2) {
              t2.run(function () {
                var photo_id = photo_url.match(/(\d+$)/)[1];
                flickr.rest.photos.comments.getList(photo_id, function (user_ids) {
                  sys.debug(xxx++)
                  emitter.emit("data", [xxx, photo_url, _.intersect(contact_ids, user_ids)]);
                  if ((i1 == c1 - 1) && (i2 == c2 - 1)) {
                    emitter.emit("close");
                  }
                  t2.free();
                });
              });
            });
            t1.free();
          });
        });
      });
    });
  });
  return emitter;
};
