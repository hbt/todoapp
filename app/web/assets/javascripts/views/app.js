/**
 * view for whole app
 */
define(['jquery', 'utils/utils', 'backbone', 'views/task/new', 'views/task/list'], function($, Utils, Backbone, TaskNewView, TaskListView) {
    var AppView = Backbone.View.extend({

        initialize: function() {
            // task capture view
            new TaskNewView()

            // monitor tasks container
            new TaskListView()

            $('.googleLogin').click(function(){
                window.location.href = AppConfig.server
            })
        }
    })

    return AppView

})
