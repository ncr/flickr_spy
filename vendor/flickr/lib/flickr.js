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
      lookupUser: function (url) {
        var promise = new process.Promise();
        restler.get(
          host + restPath, 
          { 
            query: process.mixin(defaultParams, { method: "flickr.urls.lookupUser", url: url }),
            parser: restler.parsers.json 
          }
        ).addListener("success", function (data) {
          var user_id = data.user.id;
          promise.emitSuccess(user_id);
        }).addListener("error", function (data) {
          promise.emitError(data);
        });
        return promise;
      }
    },
    contacts: {
      getPublicList: function (user_id) {
        var promise = new process.Promise();
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
          promise.emitSuccess(user_ids);
        }).addListener("error", function (data) {
          promise.emitError(data);
        });
        return promise;
      }
    },
    photos : {
      getInfo: function (photo_id) {
        var promise = new process.Promise();
        restler.get(
          host + restPath,
          {
            query: process.mixin(defaultParams, { method: "flickr.photos.getInfo", photo_id: photo_id }),
            parser: restler.parsers.json 
          }
        ).addListener("success", function (data) {
          promise.emitSuccess(data.photo);
        }).addListener("error", function (data) {
          promise.emitError(data);
        });
        return promise;
      },
      comments: {
        getList: function (photo_id) {
          var promise = new process.Promise();
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
            promise.emitSuccess(user_ids);
          }).addListener("error", function (data) {
            promise.emitError(data);
          });
          return promise;
        }
      }
      
    }
  }, 
  feeds: {
    photosComments: function (user_id) {
      var promise = new process.Promise();
      restler.get(
        host + "/services/feeds/photos_comments.gne", 
        { 
          query: process.mixin(defaultParams, { user_id: user_id }), 
          parser: restler.parsers.json 
        }
      ).addListener("success", function (data) {
        var photo_ids = [];
        data.items.forEach(function (p) {
          var m = p.link.match(/(\d+)\/comment\d+\/$/); // won't match sets
          if (m) { 
            var photo_id = m[1];
            if (photo_ids.indexOf(photo_id) == -1) {
              photo_ids.push(photo_id);
            }
          }
        });
        promise.emitSuccess(photo_ids);
      }).addListener("error", function (data) {
        promise.emitError(data);
      });
      return promise;
    }
  }
};
