// start using nodemon -d 0.5 app.js
var logging = require('./logging')
logging.init()

require('./common_utils')
var config = require('./config').getConfig()

// connect to db
var db = require('./db.js')
db.init()

// express server
var express = require('express')
var app = express.createServer();

app.get('/', function(req, res) {
    res.send('main page')
});
app.listen(config.server.port);

// web sockets
var socket = require('./socket')
socket.init(app)
