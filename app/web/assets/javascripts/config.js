var AppConfig = {
    server: 'http://10.42.43.10:9099',
    // prefix used by local storage -- needed to avoid overwriting chrome extensions storage
    prefix: 'tasktree-',
    genkey: function(key) {
        var val = ''
        if (AppConfig.inTestMode()) {
            if (!window.val) window.val = +new Date() * Math.random()
            val = window.val
        }

        return AppConfig.prefix + val + key
    },

    inTestMode: function() {
        return DEBUG && (_.include(['#devtests', '#tests'], window.location.hash))
    }
}
