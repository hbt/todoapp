/**
 * view to capture task
 */
define(['collections/tasks'], function(Tasks) {
    var TaskNewView = Backbone.View.extend({
        el: $('.first-input'),
        events: {
            // add new task on enter
            'keypress': 'addNew'
            // TODO:(hbt) clear field on blur
        },

        addNew: function(e) {
            // on enter
            if (e.keyCode === 13) {
                Tasks.create({
                    title: e.target.value
                }, {
                    at: 0
                })

                e.target.value = ''
            }
        },

        initialize: function() {}
    })

    return TaskNewView
})
