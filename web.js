var express = require('express');

var app = express.createServer(express.logger());

var buf = new Buffer(256);
buf = fs.readFileSync('index.html');
var string1 = buf.toString();



app.get('/', function(request, response) {
  response.send(string1);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
