define(['store', 'models/task', 'mixins'], function(Store, Task, Mixins) {
    var Collection = Backbone.Collection.extend({
        model: Task,
        modelName: 'Task',
        localStorage: new Store(AppConfig.genkey("tasks"))
    });

    Mixins.patterns.applySingletonPattern(Collection)
    _.extend(Collection.prototype, Mixins.Collections.DeletedAt)

    AppConfig.collections['Task'] = Collection.getInstance()

    return Collection.getInstance()
})
