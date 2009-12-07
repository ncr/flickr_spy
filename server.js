var sys = require("sys"), 
  flickr = require("./vendor/flickr/lib/flickr").flickr,
  throttle = require("./vendor/throttle/lib/throttle"),

  username = process.ARGV[2] || "ncr",
  connectionsCount = 3,

  userUrl = "http://flickr.com/photos/" + username;

sys.puts("* Flickr Spy: " + userUrl);

flickr.rest.urls.lookupUser(userUrl, function (user_id) {
  flickr.rest.contacts.getPublicList(user_id, function (user_ids) {
    var t = throttle.create(connectionsCount);
    user_ids.forEach(function (user_id) {
      t.run(function () {
        flickr.feeds.photosComments(user_id, function (photo_urls) {
          photo_urls.forEach(function (photo_url) {
            flickr.rest.photos.comments.getList(photo_url.match(/(\d+$)/)[1], function (user_ids) {
              sys.debug(sys.inspect([photo_url, user_ids]))
            });
          });
          t.free();
        });
      });
    });
  });
});
