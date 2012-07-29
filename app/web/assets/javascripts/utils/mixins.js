define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Mixins = {
        Models: {},
        Collections: {}
    }

    /**
     * adds createdAt + updatedAt fields (timestamps)
     * when saving or creating records
     */
    Mixins.Models.CreatedUpdatedAt = {
        save: function(key, value, options) {
            var save = true
            var date = new Date()
            if (this.isNew()) {
                this.set('createdAt', date.getTime())
            }

            if (!(value && value.skip_remote)) {
                this.set('updatedAt', date.getTime())
            }

            // updatedAt must be higher than value in storage in order to save
            save = !(key && key['updatedAt'] && this.get('updatedAt') && key['updatedAt'] < this.get('updatedAt'))

            if (save) {
                Backbone.Model.prototype.save.apply(this, arguments)
            }
        }
    }

    /**
     * adds support for custom formatters
     */
    Mixins.Models.CustomGetters = {
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

    /**
     * deleted behavior
     * marks records as deleted instead of actually deleting them
     * use options.force = true to force a destroy
     */
    Mixins.Models.DeletedAt = {
        destroy: function(options) {
            this.save({
                'deletedAt': +new Date()
            }, options)

            this.collection.remove(this.collection._byId[this.get('id')])

            this.trigger('destroy')
            if (options && options.force) {
                delete options['force']
                Backbone.Model.prototype.destroy.apply(this, arguments)
            } else {
                this.trigger('destroy')
            }
        }
    }

    Mixins.Collections.DeletedAt = {
        fetch: function(options) {
            options = options || {}

            if (options && options.include_deleted) {} else {
                var baksuccess = options && options.success

                // trigger the reset from the callback
                if (options.silent === undefined) {
                    options.silent = true
                    options.force_reset = true
                }

                options.success = function(collection, objects) {
                    if (baksuccess) baksuccess(collection, objects)
                    var models = collection.where({deletedAt: null})
                    collection.reset([], {silent: true})
                    collection.add(models, {silent: true})

                    // trigger reset unless user explicitely passed options.silent = true
                    if (options.force_reset) {
                        collection.trigger('reset')
                    }
                }
            }

            return Backbone.Collection.prototype.fetch.apply(this, [options])
        },

        destroyAll: function(opts) {
            opts = opts || {}
            while (this.length != 0) {
                this.at(0).destroy(opts)
            }
        }
    }

    return Mixins
})
