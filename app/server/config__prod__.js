// TODO: integrate configuration abstraction
// use for both app & web
exports.getConfig = function() {
    return {
        "db": {
            "name": "tasktree",
            "user": "admin",
            "pwd": "admin",
            "port": "27017",
            "host": "localhost"
        },
        "server": {
            "port": 9099
        },
        "google": {
            "id": "",
            "secret": "",
            "callback": "http://tasktree.hbtlabs.com:9099/oauth2callback"
        },
        "app": {
            "url": "http://tasktree.hbtlabs.com"
        }
    }
}
