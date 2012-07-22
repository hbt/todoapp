define(['handlebars', 'text!templates/task/edit.html'], function(HB, tmpltxt) {
    var TaskEditView = Backbone.View.extend({
        tmpl: HB.compile(tmpltxt),

        events: {
            'keyup': 'save',
            'click .task-status': 'toggleDone'
        },

        toggleDone: function(e) {
            this.model.save({
                'done': !this.model.get('done')
            })
            this.render()
        },

        save: function(e) {
            if (this.model.get('title') !== e.target.value) {
                this.model.save({
                    title: e.target.value
                }, {
                    silent: true
                })
            }
        },

        initialize: function(model) {
            this.model = model
            this.model.bind('sync', function(model, obj, attrs) {
                if (!attrs.silent) this.render()
            }, this)
        },

        render: function() {
            var html = this.tmpl(this.model.toFormattedJSON())
            // by default, view has model attributes embedded
            if (this.el.getAttribute('id') == this.model.id) {
                // create
                this.el = $(html)
                // sync events to new this.el
                this._ensureElement();
                this.delegateEvents();
            } else {
                // update
                this.el.innerHTML = html
            }

            return this
        }
    })

    return TaskEditView
})
