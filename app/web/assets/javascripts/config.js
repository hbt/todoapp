var AppConfig = {
    // prefix used by local storage -- needed to avoid overwriting chrome extensions storage
    prefix: 'tasktree-',
    port: 9099,
    genkey: function(key) {
        var val = ''
        if (window.location.hash.indexOf('#testWindow_') !== -1) {
            val = window.location.hash.replace('#testWindow_', '')
        }
        if (AppConfig.inTestMode() || window.location.hash.indexOf('#testInstance_') !== -1) {
            if (!window.val) window.val = Math.floor(Math.random() * 100 + 1);
            val = window.val
        }

        return AppConfig.prefix + val + key
    },

    inTestMode: function() {
        var strs = ['#devtests', '#tests']
        var ret = false
        _.each(strs, function(str) {
            if (ret) return;
            ret = DEBUG && window.location.hash.indexOf(str) !== -1
        })
        return ret
    },

    // determine server/socket path
    init: function() {
        var location = window.location
        AppConfig.server = location.protocol + "//" + location.hostname + ":" + AppConfig.port
    },

    models: {},
    collections: {}
}
