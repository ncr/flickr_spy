var sys = require("sys"), 
  flickr = require("./vendor/flickr/lib/flickr").flickr,
  underscore = require("./vendor/underscore/underscore"),
  throttle = require("./vendor/throttle/lib/throttle"),

  username = process.ARGV[2] || "ncr",
  userUrl = "http://flickr.com/photos/" + username;

sys.puts("* Flickr Spy: " + userUrl);

flickr.rest.urls.lookupUser(userUrl, function (user_id) {
  flickr.rest.contacts.getPublicList(user_id, function (user_ids) {
    var contact_ids = user_ids;
    var t1 = throttle.create(3);
    user_ids.forEach(function (user_id) {
      t1.run(function () {
        flickr.feeds.photosComments(user_id, function (photo_urls) {
          var t2 = throttle.create(3);
          photo_urls.forEach(function (photo_url) {
            t2.run(function () {
              flickr.rest.photos.comments.getList(photo_url.match(/(\d+$)/)[1], function (user_ids) {
                sys.debug(sys.inspect([photo_url, _.intersect(contact_ids, user_ids)]))
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
