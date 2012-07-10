//
// start using nodemon -d 0.5 app.js

var db = require('./db.js')

db.testM()



//var doc = { author : 'joe', created : new Date('03/28/2009') }
//db.w.save(doc)



var express = require('express')
var app = express.createServer();

// configuration
//http://expressjs.com/guide.html
//
//app.configure('development', function(){
//    app.use(express.static(__dirname + '/public'));
//    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});
//
//app.configure('production', function(){
//  var oneYear = 31557600000;
//  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
//  app.use(express.errorHandler());
//});

app.get('/', function(req, res){
  var task = db.testM()
  res.send(task.createdAt)
});

app.get('/main/gg', function(req, res){
  res.send('main');
});

app.listen(3000);


// TODO:
// read parallel vs serial http://howtonode.org/control-flow
// node.js blog http://howtonode.org/

// fix mongo console
// upgrade mongodb http://stackoverflow.com/questions/4050813/how-come-when-i-push-up-on-mongodbs-console-it-doesnt-cycle-through-my-prev