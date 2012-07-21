define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Mixins = {
        Models: {}
    }

    Mixins.Models.CreatedUpdatedAt = {
        save: function(key, value, options) {
            if (this.isNew()) {
                this.set('createdAt', new Date().getTime())
            }

            if (!(value && value.silent)) {
                this.set('updatedAt', new Date().getTime())
            }

            Backbone.Model.prototype.save.apply(this, [key, value, options])
        }
    }

    return Mixins
})
