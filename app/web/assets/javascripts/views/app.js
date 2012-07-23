/**
 * view for whole app
 */
define(['jquery', 'config', 'utils/utils', 'backbone', 'views/task/new', 'views/task/list'], function($, AppConfig, Utils, Backbone, TaskNewView, TaskListView) {
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
