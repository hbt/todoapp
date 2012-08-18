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
            "id": "590769436396.apps.googleusercontent.com",
            "secret": "3xyC_j_w4BUFUjzJ3JfsZlF0",
            "callback": "http://tasktree.hbtlabs.com:9099/oauth2callback"
        },
        "app": {
            "url": "http://tasktree.hbtlabs.com"
        }
    }
}
