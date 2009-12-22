var sys = require("sys");

exports.ws = {
  use: function (request, response, listener) {
    request.connection.setTimeout(0);
    response.use_chunked_encoding_by_default = false;
    response.closeOnFinish = true;
    response.sendHeader(101, {
      "Upgrade": "WebSocket",
      "Connection": "Upgrade",
      "WebSocket-Origin": request.headers["origin"],
      "WebSocket-Location": "ws://" + request.headers["host"] + request.uri.full
    });
    
    var webSocket = new process.EventEmitter();
    request.connection.addListener("body", function (data) {
      sys.debug("1")
      webSocket.emit("receive", data);
    }).addListener("close", function () {
      sys.debug("2")
      webSocket.emit("close");
    });
    
    webSocket.send = function (data) {
      response.sendBody("\u0000", "binary");
      response.sendBody(data, "binary");
      response.sendBody("\uffff", "binary");
    }
    
    webSocket.close = function () {
      response.finish();
    }

    listener(webSocket);
    webSocket.emit("connect");
  }
}
