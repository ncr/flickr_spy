var sys = require("sys"), 
  flickr = require("./vendor/flickr/lib/flickr").flickr,
  throttle = require("./vendor/throttle/lib/throttle"),

  username = process.ARGV[2] || "ncr",
  connectionsCount = process.ARGV[3] || 10,

  userUrl = "http://flickr.com/photos/" + username;

sys.puts("* Flickr Spy: " + userUrl);

flickr.rest.urls.lookupUser(userUrl, function (user_id) {
  flickr.rest.contacts.getPublicList(user_id, function (user_ids) {
    var t = throttle.create(connectionsCount);
    user_ids.forEach(function (user_id) {
      t.run(function () {
        flickr.feeds.photosComments(user_id, function (photo_ids) {
          sys.puts(sys.inspect(photo_ids))
          t.free();
        });
      });
    });
  });
});
