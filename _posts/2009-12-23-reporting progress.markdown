<h1>Flick Spy - progress report</h1>
  
Streaming data to browser through Web Sockets.

_For older browsers Flash emulation kicks in._

Left: server debug during client request. The server is hammering Flickr (I hope they are ok there ;), gets the data, processes it and sends results back to a browser instantly. No buffering. Real Time.

Right: browser, Firebug console.

<object type="application/x-shockwave-flash" width="400" height="300" data="http://www.flickr.com/apps/video/stewart.swf?v=71377" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> <param name="flashvars" value="intl_lang=en-us&photo_secret=bc9bf2a911&photo_id=4208724439&flickr_show_info_box=true"></param> <param name="movie" value="http://www.flickr.com/apps/video/stewart.swf?v=71377"></param> <param name="bgcolor" value="#000000"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="http://www.flickr.com/apps/video/stewart.swf?v=71377" bgcolor="#000000" allowfullscreen="true" flashvars="intl_lang=en-us&photo_secret=bc9bf2a911&photo_id=4208724439&flickr_show_info_box=true" height="300" width="400"></embed></object>
