/**
 * view for whole app
 */
define(['jquery', 'backbone', 'views/task/new'], function($, Backbone, TaskNew) {
    var AppView = Backbone.View.extend({

        initialize: function() {
            // task capture view
            new TaskNew()
        }

    })

    return AppView

})
