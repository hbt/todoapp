var AppConfig = {
    server: 'http://10.42.43.10:9099',
    // prefix used by local storage -- needed to avoid overwriting chrome extensions storage
    prefix: 'tasktree-',
    genkey: function(key) {
        return AppConfig.prefix + key
    }
}
