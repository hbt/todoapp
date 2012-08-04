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
            "id": "989078473164-o89nd0hl059nun1s1pbuqgj6uf9euaga.apps.googleusercontent.com",
            "secret": "EMehR_Nfe4SYo2oBQxFUQTbu",
            "callback": "http://192.168.0.100:9099/oauth2callback"
        }
    }
}
