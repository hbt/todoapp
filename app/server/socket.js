var db = require('./db.js')
var io = require('socket.io')
var _ = require('underscore')
require('./common_utils')

var fs = require('fs');

var walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = dir + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    };


var socket = null
exports.init = function(app) {
        // get modules recursively
        walk('./modules', function(err, res) {
            if (err) throw err

            // require modules
            var socketHandlers = res
            socketHandlers = _.map(socketHandlers, function(v) {
                return require(v)
            })

            // boot socket
            socket = io.listen(app)

            // TODO(hbt): add production environment support. check https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO Advised production settings
            // set env using NODE_ENV=XXX
            socket.configure('development', function() {
                socket.set('transports', ['websocket']);
                socket.set('log level', 2);
            });

            // loop through modules and add listeners
            _.each(socketHandlers, function(v) {
                socket.on('connection', v.handleConnection)
            })
        })
    }
