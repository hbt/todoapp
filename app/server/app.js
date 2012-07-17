// start using nodemon -d 0.5 app.js
require('./common_utils')

var db = require('./db.js')
db.init()

// express server
var express = require('express')
var app = express.createServer();

app.get('/', function(req, res) {
    res.send('main page')
});
app.listen(3000);

// web sockets
var socket = require('./socket')
socket.init(app)
