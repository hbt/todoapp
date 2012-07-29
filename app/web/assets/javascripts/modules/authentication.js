define(['utils/utils', 'utils/sync'], function(Utils, WS) {
    var Auth = function() {
            function login(callback) {
                // is this the first visit?
                if (!getUserId()) {
                    createAnonymousAccount()
                }

                authenticateAccount(callback)
            }

            /**
             * returns user id in local storage
             */

            function getUserId() {
                var ret = localStorage.getItem(AppConfig.genkey("user-id"));

                // use custom ID for tests to simulate users
                if (window.location.hash && window.location.hash.indexOf('#testInstance_') !== -1) {
                    ret = window.location.hash.replace('#testInstance_', '')
                }

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
                    if (callback) callback(info)
                })
            }

            /**
             * returns remote info associate to current user
             */

            function getUserInfo() {
                var ret = JSON.parse(localStorage.getItem(AppConfig.genkey('user-info')) || "{}")
                return (!_.isEmpty(ret) && ret) || null
            }

            /**
             * logs the user out
             * - clears offline storage
             * - disconnects socket
             *
             * TODO(hbt) review this after google login implementation
             */

            function logout(callback) {
                WS.connect().emit('auth/logout', AppConfig.inTestMode(), function(info) {
                    WS.disconnect()
                    Utils.clearLocalStorage()
                    if (callback) callback(info)
                })
            }

            return {
                login: login,
                logout: logout,
                getUserId: getUserId,
                getUserInfo: getUserInfo
            }
        }()

        return Auth
})
