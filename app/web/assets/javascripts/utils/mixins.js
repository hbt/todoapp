define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Mixins = {
        Models: {}
    }

    /**
     * adds createdAt + updatedAt fields (timestamps)
     * when saving or creating records
     */
    Mixins.Models.CreatedUpdatedAt = {
        save: function(key, value, options) {
            if (this.isNew()) {
                this.set('createdAt', new Date().getTime())
            }

            if (!(value && value.skip_remote)) {
                this.set('updatedAt', new Date().getTime())
            }

            Backbone.Model.prototype.save.apply(this, arguments)
        }
    }

    /**
     * adds support for custom formatters
     */
    Mixins.Models.customGetters = {
        get: function(attr) {
            if (typeof this[attr] == 'function') {
                return this[attr].apply(this, arguments)
            }

            return this.getRaw.apply(this, arguments)
        },

        getRaw: function() {
            return Backbone.Model.prototype.get.apply(this, arguments);
        },

        toFormattedJSON: function() {
            var res = {}
            var model = this

            _.each(this.attributes, function(value, name) {
                res[name] = model.get(name)
            })

            return res
        }
    }

    return Mixins
})
