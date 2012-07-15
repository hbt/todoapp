define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Mixins = {
        Models: {}
    }

    Mixins.Models.CreatedUpdatedAt = {
        save: function(key, value, options) {
            if (this.isNew()) {
                this.set('createdAt', new Date().getTime())
            }

            if (value && value.skip_remote) {} else {
                this.set('updatedAt', new Date().getTime())
            }
            //            c.l('hh', options.skip_remote)
            Backbone.Model.prototype.save.apply(this, [key, value, options])
        }
    }

    return Mixins
})
