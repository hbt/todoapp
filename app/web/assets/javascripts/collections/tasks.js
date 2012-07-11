define(['store', 'models/task'], function(Store, Task){
    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        localStorage: new Store("tasks"),
            
        instance: 'gg',

        getInstance: function() {
            c.l(this.instance)
        }
    });

    TasksCollection.instance = null
    TasksCollection.getInstance  = function() {
        if(TasksCollection.instance == null)
            TasksCollection.instance = new TasksCollection()

        return TasksCollection.instance
    }
        
    return TasksCollection.getInstance()
})

