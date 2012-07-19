define(['jquery'], function($) {
    var Utils = function() {
            var DEBUG = window.DEBUG

            function initializeDebugMode() {
                if (DEBUG) {
                    $('#debug').show()
                    var version = -1
                    $(function() {
                        setInterval(function() {
                            $.ajax({
                                url: '/version.txt',
                                dataType: 'script',
                                complete: function(data) {
                                    if (data.status == 304) console.log('not working -- caching issue');

                                    data = +data.responseText

                                    if (version === -1) version = data
                                    if (version < data) {
                                        window.location.reload()
                                    }
                                }
                            });
                        }, 500)
                    })
                }
            }

            /**
             * same algorithm as backbone local storage
             * */

            function generateUniqueId() {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                function guid() {
                    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                }

                return guid()
            }

            /**
             * returns if we can run automated tests
             * mainly triggered by Test link in index.html or browser URL
             */

            function isTestModeOn() {
                return DEBUG && window.location.hash === "#runTests"
            }

            /**
             * clear storage if it starts by our prefix
             */

            function clearLocalStorage() {
                _.each(_.keys(localStorage), function(key) {
                    if (key.startsWith(AppConfig.prefix)) {
                        localStorage.removeItem(key)
                    }
                })
            }

            function getLocalStorageSize() {
                var ret = 0
                _.each(_.keys(localStorage), function(key) {
                    if (key.startsWith(AppConfig.prefix)) {
                        ret++
                    }
                })

                return ret
            }

            return {
                initDebug: initializeDebugMode,
                inTestMode: isTestModeOn,
                inDebugMode: DEBUG,
                genUniqId: generateUniqueId,
                clearLocalStorage: clearLocalStorage,
                getLocalStorageSize: getLocalStorageSize
            }
        }()
        
        return Utils
});

function resetStorage() {
    localStorage.clear()
}
