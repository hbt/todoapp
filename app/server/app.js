// start using nodemon -d 0.5 app.js
var logging = require('./logging')
logging.init()

var url = require('url')

//var auth = require('everyauth')
var cauth = require('connect-auth')

require('./common_utils')
var config = require('./config').getConfig()

// connect to db
var db = require('./db.js')
db.init()

//c.l(cauth.Google2)

// This middleware detects login requests (in this case requests with a query param of ?login_with=xxx where xxx is a known strategy)
var example_auth_middleware= function() {
  return function(req, res, next) {
    var urlp= url.parse(req.originalUrl, true)
    if( urlp.query.login_with ) {
      req.authenticate([urlp.query.login_with], function(error, authenticated) {
        if( error ) {
          // Something has gone awry, behave as you wish.
          console.log( error );
          res.end('shit');
      }
      else {
          if( authenticated === undefined ) {
            // The authentication strategy requires some more browser interaction, suggest you do nothing here!
          }
          else {
            // We've either failed to authenticate, or succeeded (req.isAuthenticated() will confirm, as will the value of the received argument)
            c.l('ssssssssssssssssssssssss', req)
            
            next();
          }
      }});
    }
    else {
      next();
    }
  }
};

// express server
var express = require('express')
var app = express.createServer();

var google2Id = '989078473164-o89nd0hl059nun1s1pbuqgj6uf9euaga.apps.googleusercontent.com'
var google2Secret = 'EMehR_Nfe4SYo2oBQxFUQTbu'
var google2CallbackAddress = 'http://localhost:9099/oauth2callback'

app.configure(function() {
    app.use(express.bodyParser())
    app.use(express.cookieParser())
    app.use(express.session({secret: "gfda78325ngdfa"}))
    app.use(express.errorHandler())
    app.use(cauth({strategies:[
                     cauth.Google2({appId : google2Id, appSecret: google2Secret, callback: google2CallbackAddress, requestEmailPermission: true})],
              trace: true
//              logoutHandler: require('../lib/events').redirectOnLogout("/")
          }))
    app.use(example_auth_middleware())
})

app.get('/', function(req, res) {
       if( req.isAuthenticated() ) {
       res.send('hello ' + JSON.stringify(req.getAuthDetails().user.name))
     }
     else {
    res.send('main page <a href="?login_with=google2"> google </a>')
     }
});
app.get("/", function(req, res, params) {
//     res.writeHead(200, {'Content-Type': 'text/html'})
     if( req.isAuthenticated() ) {
       res.send('hello ' + JSON.stringify(req.getAuthDetails().user))
     }
     else {
       res.send('not auth ' + req.originalUrl)
     }
   })
   
app.use("/", function(req, res, params) {
     res.writeHead(200, {'Content-Type': 'text/html'})
     if( req.isAuthenticated() ) {
       res.end('hello ' + JSON.stringify(req.getAuthDetails().user))
     }
     else {
       res.end('not auth ' + req.originalUrl)
     }
   })
app.listen(config.server.port);

// web sockets
var socket = require('./socket')
socket.init(app)
