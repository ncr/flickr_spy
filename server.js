var nano = function (template, data) {
  return template.replace(/\{([\w\.]*)}/g, function (str, key) {
    var keys = key.split("."), value = data[keys.shift()];
    keys.forEach(function (key) { value = value[key] });
    return value;
  });
};

var sys = require("sys"), 
  http = require("http"),
  host = "api.flickr.com",
  junk = "api_key=3f6ad5daec2a6a194c54f19ea38dbe5d&format=json&nojsoncallback=1",
  urls = {
    user: "/services/rest/?method=flickr.urls.lookupUser&{junk}&url={url}",
    contacts: "/services/rest/?method=flickr.contacts.getPublicList&{junk}&user_id={user_id}",
    comments: "/services/feeds/photos_comments.gne?{junk}&user_id={user_id}"
  },
  flickr = http.createClient(80, host),
  username = process.ARGV[2] || "ncr",
  count = process.ARGV[3] || 50,
  url = "http://flickr.com/photos/" + username;

sys.puts("* Spying for: " + url);
  
flickr.get(nano(urls.user, { junk: junk, url: encodeURIComponent(url) }), { host: host }).finish(function (res) {
  res.setBodyEncoding("utf8");
  var body = [];
  res.addListener("body", function (chunk) {
    body.push(chunk);
  });
  res.addListener("complete", function () {
    var user_id = JSON.parse(body.join("")).user.id;
    flickr.get(nano(urls.contacts, { junk: junk, user_id: user_id }), { host: host }).finish(function (res) {
      res.setBodyEncoding("utf8");
      var body = [];
      res.addListener("body", function (chunk) {
        body.push(chunk);
      });
      res.addListener("complete", function () {
        var clients = [];
        for(var i = 0; i < count; i++){
          clients.push(http.createClient(80, host));
        }
        JSON.parse(body.join("")).contacts.contact.forEach(function (c) {
          var user_id = c.nsid;
          var flickr = clients[Math.floor(Math.random() * count)];
          flickr.get(nano(urls.comments, { junk: junk, user_id: user_id }), { host: host }).finish(function (res) {
            res.setBodyEncoding("utf8");
            var body = [];
            res.addListener("body", function (chunk) {
              body.push(chunk);
            });
            res.addListener("complete", function () {
              var first = JSON.parse(body.join("")).items[0];
              if(first){ sys.puts(first.link) };
            });
          });
        });
      });
    });
  });
});
