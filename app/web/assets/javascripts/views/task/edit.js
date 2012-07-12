define(['handlebars', 'text!templates/task/edit.html'], function(HB, tmpltxt)
{
    var TaskEditView = Backbone.View.extend(
    {
        model: null,

        tmpl: HB.compile(tmpltxt),

        initialize: function(model)
        {
            this.model = model
            this.model.bind('sync', this.render, this)
        },

        render: function()
        {


            var html = this.tmpl(
            {
                id: this.model.get('id'),
                title: this.model.get('title')
            })

            var el = document.getElementById('task-' + this.model.id)
            if (el)
            {
                el.innerHTML = html
            }
            else
            {
                $('#results').append(html)
            }
            return this
        },

        submit: function()
        {}
    })

    return TaskEditView
})
