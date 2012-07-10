
////http://www.mongodb.org/display/DOCS/Inserting
//http://mongoosejs.com/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo');

//var Db = require('./node_modules/mongodb').Db,
//Connection = require('./node_modules/mongodb').Connection,
//Server = require('./node_modules/mongodb').Server;
//
//var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ?
//process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
//var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ?
//process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

exports.testM = function(str) {
  //  var conn = mongoose.createConnection('your connection string');
  //  var MyModel = conn.model('ModelName', schema);
  //  var m = new MyModel;
  //  m.save() // works
  var taskSchema = new mongoose.Schema({
    title     : String,
    createdAt      : Date
  });

  var Task = mongoose.model('Task', taskSchema);
  var t = new Task()
  t.title = str
  t.createdAt = new Date()
  t.save()

  Task.find({}, function(err, tasks){
    for(var t in tasks) {
      console.log(tasks[t].remove())
    }
  })

  return t

}