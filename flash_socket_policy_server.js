require("tcp").createServer(function (c) {
  c.addListener("receive", function () {
    c.send('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
    c.close();
  });
}).listen(843);
