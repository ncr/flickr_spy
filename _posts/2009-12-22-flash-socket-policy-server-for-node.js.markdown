I wanted to use [Web Sockets](http://dev.w3.org/html5/websockets/) in Flickr Spy. It would let me stream
json data to users during lengthy api request batches made by server.
The problem is that Web Sockets are not widely supported by all
browsers yet. They will be eventually, as they are part of HTML5 standard.

In the meantime [Hiroshi Ichikawa](http://github.com/gimite) 
created a 
[Javascript/Flash Web Sockets emulation](http://github.com/gimite/web-socket-js) 
so you can write normal Web Sockets Javascript code
and all network communication will be taken care of by Flash.

There is one gotcha here - you have to serve so called [Flash Socket Policy](http://www.lightsphere.com/dev/articles/flash_socket_policy.html)
file either as a part of Web Sockets server or separately on port 843.
I chose to do it separately so I can have a clean Web Sockets server
and eventually just shut down the policy server. The opposite solution
is shown [here](http://blog.new-bamboo.co.uk/2009/12/7/real-time-online-activity-monitor-example-with-node-js-and-websocket).

So here's a quick gist. A very minimal Flash Socket Policy server for
ad-hoc use.

<script src="http://gist.github.com/261697.js"> </script>
