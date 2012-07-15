define(['handlebars', 'text!templates/task/edit.html'], function(HB, tmpltxt) {
    var TaskEditView = Backbone.View.extend({
        tmpl: HB.compile(tmpltxt),

        events: {
            'keyup': 'save'
        },

        save: function(e) {
            if (this.model.get('title') !== e.target.value) {
                // TODO: add enter save vs keypress option
                this.model.save({
                    title: e.target.value
                })
            }
        },

        initialize: function(model) {
            this.model = model
            this.model.bind('render', this.render, this)
        },

        render: function() {
            var html = this.tmpl({
                title: this.model.get('title')
            })

            // by default, view has model attributes embedded
            if (this.el.getAttribute('id') == this.model.id)
            // create
            this.el = $(html)
            else
            // update
            this.el.innerHTML = html

            // sync events to new this.el
            // TODO: check if this is needed on update
            this._ensureElement();
            this.delegateEvents();

            return this
        }
    })

    return TaskEditView
})
