/**
 * view for whole app
 */
define(['jquery', 'backbone', 'views/task/new', 'views/task/list'], function($, Backbone, TaskNewView, TaskListView) {
    var AppView = Backbone.View.extend({

        initialize: function() {
            // task capture view
            new TaskNewView()

            // monitor tasks container
            new TaskListView()
        }

    })

    return AppView

})
