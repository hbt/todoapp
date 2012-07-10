var c = console;
c.l = console.log;

// https://github.com/PaulUithol/Backbone-relational/
var Task = Backbone.Model.extend({
  defaults: {
    title: "",
    createdAt: null
  },

  url: '/asd/',

  save: function() {
    this.set({
      createdAt: new Date()
    })
    this.trigger('save')
  },
  initialize: function(){
  //    this.bind("change:src", function(){
  //      var src = this.get("src");
  //      console.log('Image source updated to ' + src);
  //    });
  //    this.bind("change:src", function(){
  //      var src = this.get("src");
  //      console.log('Image source updated to ' + src);
  //    });
  //
  //    this.bind("error", function(model, error){
  //      console.log(model, error);
  //    });
  }
//  changeSrc: function( source ){
//    this.set({
//      src: source
//    });
//  },
//  validate: function(att) {
//    c.l('hh', att)
//    return false
//  }
});

var TaskCollection = Backbone.Collection.extend({

  model: Task,
  localStorage: new Store("tasks")

// Returns all done todos.
//    done: function() {
//      return this.filter(function(todo){
//        return todo.get('done');
//      });
//    },
//
//    nextOrder: function() {
//      if (!this.length) return 1;
//      return this.last().get('order') + 1;
//    },
//
//    comparator: function(todo) {
//      return todo.get('order');
//    },
//
//    pluralize: function(count) {
//      return count == 1 ? 'item' : 'items';
//    }

});

var NewTask = Backbone.View.extend({

  className: "new-task",

  //  events: {
  //    "keydown .task-title":          "submit",
  //    "keypress :input":          "submit"
  //  },

  initialize: function() {
    $('.new-task .task-title').bind('keydown', this.submit)

  },

  render: function() {
  },

  submit: function(e) {
    if(e.keyCode == 13) {
      var task = new Task({
        title: e.target.value
      })
      var tt = new TaskCollection()
      tt.localStorage.create(task)
    }
  }
});

var EditTask = Backbone.View.extend({

  className: "task",

  //  events: {
  //    "keydown .task-title":          "submit",
  //    "keypress :input":          "submit"
  //  },

  initialize: function() {
    //    $('.new-task .task-title').bind('keydown', this.submit)
    this.model.bind("save", this.render, this)
  },

  render: function() {


    var domTask = null
    var isNew = false
    if(document.getElementById('task-' + this.model.id)) {
      domTask = $('#task-' + this.model.id)
    } else {
      domTask = $('.task').clone()
      domTask.toggleClass('task')
      //      c.l('hhh')
      isNew = true
    }
    domTask.attr({
      id: 'task-' + this.model.id
    }).children('.task-title').val(this.model.get("title"))

    this.$el = domTask

    c.l('hh')
    if(isNew)
    {
      $('#results').append(domTask);
    }

    return this
  },

  submit: function(e) {
    if(e.keyCode == 13) {
      var task = new Task({
        title: e.target.value
      })
      var tt = new TaskCollection()
      tt.localStorage.create(task)
    }
  }
});

$(document).ready(function(){
  $('.new-task .task-title').focus()
  var nv = new NewTask()

  loadTasks()
})

function loadTasks() {
  var tt = new TaskCollection()
  _.each(tt.localStorage.findAll(), function(v) {
    var tv = new Task(v)
    var ev = new EditTask({
      model: tv
    })

    //tv.set({'title': 'ww'})
    tv.save()
  })


  var t=tt.localStorage.find({
    'id': '073fa7b2-1140-9008-d2f0-d96dbee7e1f5'
  })
  c.l(tt.find({
    'id': '073fa7b2-1140-9008-d2f0-d96dbee7e1f5'
  }))
  c.l(tt)
  t = new Task(t)

  t.save()
  c.l(t)
}





//var t = new Task({title: 'nnn'})
////t.save()
//
//
//

//tt.fetch(new Task({title: 'nnn'}))

function reset() {
  var tt = new TaskCollection()

  _.each(tt.localStorage.findAll(), function(v){
    var tv = new Task(v)
    tt.localStorage.destroy(tv)
  })

}



