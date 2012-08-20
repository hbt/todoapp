define(['utils/utils', 'utils/sync'], function(Utils, WS) {
    var Auth = function() {
            function login(callback) {

                if (!getUserId()) {
                    createAnonymousAccount()
                }

                authenticateAccount(callback)
            }

            function googleLogin(id, createdAt) {
                var currentUserId = getUserId()
                if (currentUserId === id) {
                    login()
                } else {
                    migradateData(currentUserId, id, createdAt)
                }
            }

            function migradateData(fromId, toId, toCreatedAt) {
                logout()
                // migrate remote data
                WS.connect().emit('auth/migrateData', fromId, toId, toCreatedAt, function() {
                    setUserId(toId)
                    login()
                })
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
             */

            function createAnonymousAccount() {
                setUserId(Utils.genUniqId())
            }

            /**
             * uses user id (local) and contacts server to authenticate user
             */

            function authenticateAccount(callback) {
                // TODO(hbt): trigger callback if there is no socket. check WS.connect().connected boolean
                WS.connect().emit('auth/login', getUserId(), function(info) {
                    // store email + account information
                    localStorage.setItem(AppConfig.genkey("user-info"), JSON.stringify(info))
                    WS.fetchCollections()
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
             */

            function logout() {
                Utils.clearLocalStorage()
            }

            return {
                login: login,
                logout: logout,
                getUserId: getUserId,
                getUserInfo: getUserInfo,
                googleLogin: googleLogin
            }
        }()

        return Auth
})
