define(['utils/utils', 'utils/sync'], function(Utils, WS) {
    var Auth = function() {
        function login(callback) {
            // is this the first visit?
            if(!getUserId()) {
                createAnonymousAccount()
            }

            authenticateAccount(callback)
        }

        /**
         * returns user id in local storage
         */
        function getUserId() {
            var ret = localStorage.getItem(AppConfig.genkey("user-id"));
            return ret
        }

        function setUserId(id) {
            return localStorage.setItem(AppConfig.genkey("user-id"), id)
        }

        /**
         * generates user id and stores it locally
         * TODO(hbt): review this after implement google login
         */
        function createAnonymousAccount() {
            setUserId(Utils.genUniqId())
        }

        /**
         * uses user id (local) and contacts server to authenticate user
         */
        function authenticateAccount(callback) {
          WS.connect().emit('auth/login', getUserId(), function(info) {
              // store email + account information
              localStorage.setItem(AppConfig.genkey("user-info"), JSON.stringify(info))
              callback(info)
          })
        }

        /**
         * returns remote info associate to current user
         */
        function getUserInfo() {
            var ret = JSON.parse(localStorage.getItem(AppConfig.genkey('user-info')) || "{}")
            return (!_.isEmpty(ret) && ret) || null
        }

        return {
            login: login,
            getUserId: getUserId,
            getUserInfo: getUserInfo
        }
    }()

    return Auth
})
