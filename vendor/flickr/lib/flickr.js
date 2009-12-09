var restler = require("../../restler/lib/restler"),
  sys = require("sys"),
  host = "http://api.flickr.com",
  restPath = "/services/rest",
  defaultParams = {
    api_key: "3f6ad5daec2a6a194c54f19ea38dbe5d",
    format: "json",
    nojsoncallback: "1"
  };
    
exports.flickr = {
  rest: {
    urls: {
      lookupUser: function (url, callback) {
        restler.get(
          host + restPath, 
          { 
            query: process.mixin(defaultParams, { method: "flickr.urls.lookupUser", url: url }),
            parser: restler.parsers.json 
          }
        ).addListener("success", function (data) {
          var user_id = data.user.id;
          callback(user_id);
        });
      }
    },
    contacts: {
      getPublicList: function (user_id, callback) {
        restler.get(
          host + restPath, 
          { 
            query: process.mixin(defaultParams, { method: "flickr.contacts.getPublicList", user_id: user_id }), 
            parser: restler.parsers.json 
          }
        ).addListener("success", function (data) {
          var user_ids = [];
          data.contacts.contact.forEach(function (c) {
            var user_id = c.nsid;
            user_ids.push(user_id);
          });
          callback(user_ids);
        });
      }
    },
    photos : {
      comments: {
        getList: function (photo_id, callback) {
          restler.get(
            host + restPath, 
            { 
              query: process.mixin(defaultParams, { method: "flickr.photos.comments.getList", photo_id: photo_id }),
              parser: restler.parsers.json 
            }
          ).addListener("success", function (data) {
            var user_ids = [];
            if(data.comments) {
              data.comments.comment.forEach(function (c) {
                var user_id = c.author;
                if (user_ids.indexOf(user_id) == -1) {
                  user_ids.push(user_id);
                }
              });
            }
            callback(user_ids);
          });
        }
      }
      
    }
  }, 
  feeds: {
    photosComments: function (user_id, callback) {
      restler.get(
        host + "/services/feeds/photos_comments.gne", 
        { 
          query: process.mixin(defaultParams, { user_id: user_id }), 
          parser: restler.parsers.json 
        }
      ).addListener("success", function (data) {
        var photo_urls = [];
        data.items.forEach(function (p) {
          var photo_url = p.link.replace(/\/comment\d+\/$/, "");
          if (photo_urls.indexOf(photo_url) == -1) {
            photo_urls.push(photo_url);
          }
        });
        callback(photo_urls);
      });
    }
  }
};
