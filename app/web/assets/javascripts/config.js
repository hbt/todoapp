var AppConfig = {
    server: 'http://localhost:3000',
    // prefix used by local storage -- needed to avoid overwriting chrome extensions storage
    prefix: 'tasktree',
    genkey: function(key) {
        return AppConfig.prefix + key
    }
}
