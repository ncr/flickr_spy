var nano = function(template, data){
  return template.replace(/\{([\w\.]*)}/g, function(str, key){
    var keys = key.split("."), value = data[keys.shift()];
    for(i in keys){ value = value[keys[i]] };
    return value;
  });
};

var sys = require("sys"), 
  http = require("http"),
  host = "api.flickr.com",
  junk = "api_key=46c1e3ac7da832f729986bcc378abdc0&format=json&nojsoncallback=1",
  urls = {
    user: "/services/rest/?method=flickr.urls.lookupUser&{junk}&url={url}",
    contacts: "/services/rest/?method=flickr.contacts.getPublicList&{junk}&user_id={user_id}",
    comments: "/services/feeds/photos_comments.gne?{junk}&user_id={user_id}"
  },
  flickr = http.createClient(80, host),
  username = process.ARGV[2] || "ncr"
  url = "http://flickr.com/photos/" + username;
  
flickr.get(nano(urls.user, {junk: junk, url: encodeURIComponent(url)}), {host: host}).finish(function(res){
  res.setBodyEncoding("utf8");
  var body = [];
  res.addListener("body", function(chunk){
    body.push(chunk);
  });
  res.addListener("complete", function(){
    var user_id = JSON.parse(body.join("")).user.id
    // sys.puts("user_id: " + user_id)
    flickr.get(nano(urls.contacts, {junk: junk, user_id: user_id}), {host: host}).finish(function(res){
      res.setBodyEncoding("utf8");
      var body = [];
      res.addListener("body", function(chunk){
        body.push(chunk);
      });
      res.addListener("complete", function(){
        JSON.parse(body.join("")).contacts.contact.forEach(function(c){
          var user_id = c.nsid;
          // sys.puts(user_id);
          flickr.get(nano(urls.comments, {junk: junk, user_id: user_id}), {host: host}).finish(function(res){
            res.setBodyEncoding("utf8");
            var body = [];
            res.addListener("body", function(chunk){
              body.push(chunk);
            });
            res.addListener("complete", function(){
              var first = JSON.parse(body.join("")).items[0]
              if(first){
                sys.puts(first.link)
              }
            });
          })
        });
      });
    });
  });
});
