// TODO: integrate configuration abstraction
// use for both app & web
exports.getConfig = function() {
    return {
        "database": {
            "name": "tasktree",
            "user": "admin",
            "pwd": "admin",
            "port": "2244",
            "host": "localhost"
        },
        "server": {
            "port": "3000"
        }
    }
}
