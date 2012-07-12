define(['handlebars', 'text!templates/task/edit.html'], function(HB, tmpltxt)
{
    var TaskEditView = Backbone.View.extend(
    {
        tmpl: HB.compile(tmpltxt),

        events: {
            'keyup': 'save'
        },

        save: function(e)
        {
            if (this.model.get('title') !== e.target.value)
            {
                this.model.save(
                {
                    title: e.target.value
                })
            }
        },

        initialize: function(model)
        {
            this.model = model
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
                $('#results').prepend(html)
                this.el = $('#task-' + this.model.id)
                this._ensureElement();
                this.delegateEvents();
            }

            return this
        }
    })

    return TaskEditView
})
