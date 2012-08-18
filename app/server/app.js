// start using nodemon -d 0.5 app.js
var logging = require('./logging')
logging.init()

var cauth = require('./modules/auth/auth')


require('./common_utils')
var config = require('./config').getConfig()

// connect to db
var db = require('./db.js')
db.init()

// express server
var express = require('express')
var app = express.createServer();

app.configure(function() {
    app.use(express.bodyParser())
    app.use(express.cookieParser())
    app.use(express.session({
        secret: "tasktree-" + uniqueID()
    }))
    app.use(express.errorHandler())
    app.use(cauth.expressConfig)
    app.use(cauth.expressMiddleware())
    app.set('view engine', 'hbs');
    app.use(express.static(__dirname + '/public'));
})

app.get('/', cauth.handleLoginPage)

app.listen(config.server.port);

// web sockets
var socket = require('./socket')
socket.init(app)
