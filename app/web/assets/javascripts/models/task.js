// https://github.com/PaulUithol/Backbone-relational/
// Backbone.Model.prototype.save.call(this);

define(['store'], function(Store){
    return Backbone.Model.extend({
        localStorage: new Store("tasks"),
        defaults: {
            title: "",
            createdAt: null
        },

        initialize: function(){
        }
    });
})