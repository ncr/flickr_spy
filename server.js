var sys = require("sys"), 
  http = require("http"),
  posix = require("posix"),
  flickr = require("./vendor/flickr/lib/flickr").flickr,
  underscore = require("./vendor/underscore/underscore"),
  throttle = require("./vendor/throttle/lib/throttle"),
  static = require("./vendor/static/lib/static").static,
  ws = require("./vendor/ws/lib/ws"),
  username = process.ARGV[2] || "ncr";

sys.puts("* Flickr Spy: " + username);

http.createServer(function (req, res) {
  var path = req.uri.path;
  sys.debug(path);
  static("public", req, res);
}).listen(3000);

ws.createServer(function (websocket) {
  websocket.addListener("connect", function (resource) {
    sys.debug("connect: " + resource.slice(1));
    spy_emitter(resource.slice(1)).addListener("data", function (data) {
      websocket.send(data);
    }).addListener("close", function () {
      websocket.close();
    })
  }).addListener("receive", function (data) {
    sys.debug("receive: " + data);
  }).addListener("close", function () {
    sys.debug("close")
  });
}).listen(8080);

var spy_emitter = function (username) {
  var emitter = new process.EventEmitter(),
    url = "http://flickr.com/photos/" + username;
  
  flickr.rest.urls.lookupUser(url).addCallback(function (user_id) {
    
    flickr.rest.contacts.getPublicList(user_id).addCallback(function (user_ids) {
      var contact_ids = user_ids,
        t1 = throttle.create(3),
        todo1 = user_ids.length, done1 = 0,
        todo2 = 0, done2 = 0;
      
      user_ids.forEach(function (user_id) {
        t1.run(function () {
          
          flickr.feeds.photosComments(user_id).addCallback(function (photo_urls) {
            var t2 = throttle.create(3);
            done1++;
            todo2 += photo_urls.length;
            
            function finalize() {
              done2++;
              if (todo1 == done1 && todo2 == done2) {
                sys.debug("callback: getList: close")
                emitter.emit("close");
              }
              t2.free();
            };

            photo_urls.forEach(function (photo_url) {
              t2.run(function () {
                var photo_id = photo_url.match(/(\d+$)/)[1];
                
                /*
                flickr.photos.getInfo(photo_id).addCallback(function (photo) {
                  
                }).addErrback(function (data) {
                  sys.debug("errback: geInfo: " + data);
                });
                */
                
                flickr.rest.photos.comments.getList(photo_id).addCallback(function (user_ids) {
                  sys.debug("callback: getList: data")
                  emitter.emit("data", [photo_url, _.intersect(contact_ids, user_ids)]);
                  finalize();
                }).addErrback(function (data) {
                  // do not emit error from this loop
                  sys.debug("errback: getList: " + data);
                  finalize();
                });
                
              });
            });
            
            t1.free();
          }).addErrback(function (data) {
            emitter.emit("error");
            sys.debug("errback: photosComments: " + data);
          });
        });
      });
      
    }).addErrback(function (data) {
      emitter.emit("error");
      sys.debug("errback: getPublicList: " + data);
    });
    
  }).addErrback(function (data) {
    emitter.emit("error");
    sys.debug("errback: lookupUser: " + data);
  });
  return emitter;
};

var spy_promise = function (username) {
  var promise = new process.Promise();
  var result = [];
  spy_emitter(username).addListener("data", function (data) {
    result.push(data);
  }).addListener("close", function () {
    promise.emitSuccess(result);
  }).addListener("error", function (data) {
    promise.emitError(data);
  })
  return promise;
}

