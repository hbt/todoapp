////http://www.mongodb.org/display/DOCS/Inserting
//http://mongoosejs.com/
var _ = require('underscore')
var mongoose = require('mongoose');
require('./common_utils')

exports.init = function() {
    initDb()
    initSchema()
}

// TODO: abstract variables into config file

function initDb() {
    mongoose.connect('mongodb://localhost/todo');
}

function initSchema() {
    exports.Task = mongoose.model('Task', new mongoose.Schema({
        id: String,
        title: String,
        createdAt: Number,
        updatedAt: Number
    }));
}
