// https://github.com/PaulUithol/Backbone-relational/
// Backbone.Model.prototype.save.call(this);

App.Task = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("tasks"),
    defaults: {
        title: "",
        createdAt: null
    },

    initialize: function(){
    }
});

App.Collections.Tasks = Backbone.Collection.extend({
    model: App.Task,
    localStorage: new Backbone.LocalStorage("tasks")
});