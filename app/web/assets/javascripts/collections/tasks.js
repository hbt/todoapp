define(['store', 'models/task'], function(Store, Task)
{
    var TaskCollection = Backbone.Collection.extend(
    {
        model: Task,
        localStorage: new Store("tasks")
    });

    TaskCollection.instance = null
    TaskCollection.getInstance = function()
    {
        if (TaskCollection.instance == null) TaskCollection.instance = new TaskCollection()

        return TaskCollection.instance
    }

    return TaskCollection.getInstance()
})
