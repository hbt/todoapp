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

// TODO(hbt): move get/post handler as a separate file -- like how we handle sockets with modules
app.post('/jasmine/graphiz', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');

    var graphiz = req.body['graphiz']
    var filename = req.body['filename']
    filename = filename.replace(/[^\w\s]/gi, '') 

    var path = __dirname + '/../web/assets/images/tests/'
    var filepath = path + filename + '.dot'
    var imgpath = path + filename + '.png'
    
    var fs = require('fs');
    fs.writeFile(filepath, graphiz, function(err) {
        if(err) throw err;

        var exec = require('child_process').exec
        var ret = ''
        var cmd = 'dot -Tpng ' + filepath + ' > ' + imgpath
        exec(cmd, function(err, stdout, stderr) {
            if(err) throw err

            res.send('/assets/images/tests/' + filename + '.png')
        })
    });
})

app.listen(config.server.port);

// web sockets
var socket = require('./socket')
socket.init(app)
