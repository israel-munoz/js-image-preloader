var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/image1', function (req, res, next) {
  sendFile(res, 'image1.jpg');
});

router.get('/image2', function (_req, res, _next) {
  sendFile(res, 'image2.jpg');
});

function sendFile(res, image) {
  var img = path.join(__basedir, 'public/images/', image);
  var fileData = fs.readFileSync(img);
  var div = 1024 * 10;
  var parts = Math.ceil(fileData.length / div);
  var i = 0;
  var sendPart = (end) => {
    var part = fileData.slice(i * div, ++i * div);
    res.write(part);
    if (end) {
      res.end();
    } else {
      setTimeout(() => sendPart(i > parts), 50);
    }
  }
  res.set({
    'Content-Type': 'image/jpeg',
    'Content-Length': fileData.length,
    'Cache-Control': 'public, max-age=31557600'
  });
  sendPart();
}

module.exports = router;
