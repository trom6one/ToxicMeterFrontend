const https = require('https')
var express = require('express');
var app = express();

const fs = require('fs')

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(5000, () => {
  console.log('Listening on port 5000')
})

app.use(express.static(__dirname + '/'));

//app.use('/', express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/panel.html");
});