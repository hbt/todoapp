define(['store'], function(Store){
    var Task = Backbone.Model.extend({
        localStorage: new Store("tasks"),
        defaults: {
            title: "",
            createdAt: null
        }
    });

    return Task
})