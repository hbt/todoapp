define(['collections/tasks'], function(Tasks)
{
    var TaskNewView = Backbone.View.extend(
    {
        el: $('#task-new'),
        events: {
            'keypress': 'addNew'
        },

        addNew: function(e)
        {
            if (e.keyCode === 13)
            {
                Tasks.create(
                {
                    title: e.target.value
                }, {
                    at: 0
                })
                e.target.value = ''
            }
        }
    })

    return TaskNewView
})
