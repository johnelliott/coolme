
# coolme
😎 Add the dealwithit sunglasses to faces.

# about
I wanted to be able to add those silly pixel-art glasses from the dealwithit meme to faces with openCV.

# status
server.js - server wrapping the image transform stream
sunnues-stream.js - transform stream JPG => JPG
lib/add-glasses.js - logic/math mess and graphicsmagick to position and overlay glasses

# usage
```
$ npm start
```
```
curl -XPOST --data-binary @face.jpg http://localhost:3000 > face-with-glasses.jpg
```
