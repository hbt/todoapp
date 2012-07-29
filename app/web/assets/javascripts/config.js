var AppConfig = {
    server: 'http://192.168.0.100:9099',
    // prefix used by local storage -- needed to avoid overwriting chrome extensions storage
    prefix: 'tasktree-',
    genkey: function(key) {
        var val = ''
        if (AppConfig.inTestMode() || window.location.hash.indexOf('#testInstance_') !== -1) {
            if (!window.val) window.val = Math.floor(Math.random() * 100 + 1);
            val = window.val
        }

        return AppConfig.prefix + val + key
    },

    inTestMode: function() {
        return DEBUG && (_.include(['#devtests', '#tests'], window.location.hash))
    }
}
