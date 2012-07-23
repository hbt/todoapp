define(['store', 'models/task', 'mixins'], function(Store, Task, Mixins) {
    var TaskCollection = Backbone.Collection.extend({
        model: Task,
        modelName: 'Task',
        localStorage: new Store(AppConfig.genkey("tasks"))
    });

    _.extend(TaskCollection.prototype, Mixins.Collections.DeletedAt)

    //TODO(hbt): abstract and use mixins
    TaskCollection.instance = null
    TaskCollection.getInstance = function() {
        if (TaskCollection.instance == null) TaskCollection.instance = new TaskCollection()

        return TaskCollection.instance
    }

    return TaskCollection.getInstance()
})
