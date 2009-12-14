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
      sys.debug("data")
    }).addListener("close", function(){
      sys.debug("close")
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



var spy = function (username) {
  var emitter = new process.EventEmitter(),
    url = "http://flickr.com/photos/" + username;
  
  flickr.rest.urls.lookupUser(url, function (user_id) {
    
    flickr.rest.contacts.getPublicList(user_id, function (user_ids) {
      var contact_ids = user_ids,
        t1 = throttle.create(3),
        todo1 = user_ids.length, done1 = 0,
        todo2 = 0, done2 = 0;
      
      user_ids.forEach(function (user_id) {
        t1.run(function () {
          
          flickr.feeds.photosComments(user_id, function (photo_urls) {
            var t2 = throttle.create(3);
            done1++;
            todo2 += photo_urls.length;

            photo_urls.forEach(function (photo_url) {
              t2.run(function () {
                var photo_id = photo_url.match(/(\d+$)/)[1];
                
                flickr.rest.photos.comments.getList(photo_id, function (user_ids) {
                  emitter.emit("data", [photo_url, _.intersect(contact_ids, user_ids)]);
                  done2++;
                  if (todo1 == done1 && todo2 == done2) {
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
