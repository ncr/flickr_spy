var sys = require("sys"), 
  http = require("http"),
  rest = require("./vendor/restler/lib/restler"),
  throttle = require("./vendor/throttle/lib/throttle"),

  host = "http://api.flickr.com",
  restPath = "/services/rest",
  feedsPath = "/services/feeds/photos_comments.gne",
  defaultParams = {
    api_key: "3f6ad5daec2a6a194c54f19ea38dbe5d",
    format: "json",
    nojsoncallback: "1"
  },

  username = process.ARGV[2] || "ncr",
  connectionsCount = process.ARGV[3] || 10,

  userUrl = "http://flickr.com/photos/" + username;

sys.puts("* Flickr Spy: " + userUrl);

rest.get(host + restPath, { query: process.mixin(defaultParams, { method: "flickr.urls.lookupUser", url: userUrl }), parser: rest.parsers.json }).addListener("success", function (data) {
  var user_id = data.user.id;
  rest.get(host + restPath, { query: process.mixin(defaultParams, { method: "flickr.contacts.getPublicList", user_id: user_id }), parser: rest.parsers.json }).addListener("success", function (data) {
    var t = throttle.create(connectionsCount);
    data.contacts.contact.forEach(function (c) {
      t.run(function() {
        var user_id = c.nsid;
        rest.get(host + feedsPath, { query: process.mixin(defaultParams, { user_id: user_id }), parser: rest.parsers.json }).addListener("success", function (data) {
          var first = data.items[0];
          if (first) { sys.puts(first.link.replace(/\/comment\d+\/$/, "")) };
          t.free();
        });
      });
    });
  });
});
