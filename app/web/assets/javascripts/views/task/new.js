App.Views.TaskNew = Backbone.View.extend({
//    tmpl: _.template(Utils.getTemplate(this).html()),

    initialize: function(model)
    {
//        this.model = model
//        this.model.bind('sync', this.render, this)

    },

    render: function() {
        if(document.getElementById(this.model.id))
        {
            document.getElementById(this.model.id).innerHTML = this.tmpl({
                id: this.model.get('id'),
                title: this.model.get('title')
                })
        } else {
            $('#results').append(this.tmpl({
                id: this.model.get('id'),
                title: this.model.get('title')
                }))
        }
        return this
    },

    submit: function() {
    }



})