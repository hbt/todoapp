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
        }
    }
}
