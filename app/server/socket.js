var db = require('./db.js')
var io = require('socket.io')
var _ = require('underscore')
require('./utils')

var socket = null

exports.init = function(app) {
        socket = io.listen(app)
        socket.on('connection', handleConnection)
    }

function handleConnection(client) {
    //    c.l(client.id)
    client.join('room');
    //    client.manager.sockets['in']('room').emit('update', data)
    client.on('save', Handlers.save);
    client.on('update', Handlers.update)
}


var Handlers = {

    save: function(modelName, data, callback) {
        data = JSON.parse(data)
        var client = this
        db[modelName].findOne({
            id: data.id
        }, function(err, doc) {
            if (!doc) {
                doc = new db[modelName]()
            }

            doc = _.extend(doc, data)
            doc.save()

            callback(doc)
            c.l('hh')
            client.manager.sockets['in']('room').emit('update_one', client.id, doc)
        })
    },

    update: function(modelName, callback) {
        var client = this
        db[modelName].find({}, function(err, tasks) {
            callback(client.id, tasks)
            //    client.emit('update_res', client.id, tasks)
        })
    }
}
