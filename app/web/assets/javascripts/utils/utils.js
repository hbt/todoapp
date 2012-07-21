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
                return DEBUG && (_.include(['#devtests', '#tests'], window.location.hash))
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


            var KeyboardSimulator = {

                // TODO(hbt): replace function by jquery events
                simulateKey: function(keyChar, control, alt, shift, meta) {
                    if(keyChar === "Enter") {
                        var e = jQuery.Event("keypress");
                        e.keyCode = 13
                        $(document.activeElement).trigger(e)
                        return;
                    }

                    control = control || false
                    alt = alt || false
                    shift = shift || false
                    meta = meta || false

                    var insertMode = /^INPUT|TEXTAREA|SELECT|HTML$/i.test(document.activeElement.nodeName);
                    if (insertMode) {
                        var evt = document.createEvent('TextEvent');
                        evt.initTextEvent('textInput', true, true, null, keyChar);
                        document.activeElement.dispatchEvent(evt);
                    }

                    var k = document.createEvent("KeyboardEvent")
                    k.initKeyboardEvent("keydown", true, true, null, keyChar, false, control, alt, shift, meta)
                    document.activeElement.dispatchEvent(k);

                    k = document.createEvent("KeyboardEvent")
                    k.initKeyboardEvent("keyup", true, true, null, keyChar, false, control, alt, shift, meta)
                    document.activeElement.dispatchEvent(k);

                    k = document.createEvent("KeyboardEvent")
                    k.initKeyboardEvent("keypress", true, true, null, keyChar, false, control, alt, shift, meta)
                    document.activeElement.dispatchEvent(k);
                },

                simulateTyping: function(string) {
                    _.each(string.split(''), function(v) {
                        KeyboardSimulator.simulateKey(v)
                    })

                }
            }

            return {
                initDebug: initializeDebugMode,
                inTestMode: isTestModeOn,
                inDebugMode: DEBUG,
                genUniqId: generateUniqueId,
                clearLocalStorage: clearLocalStorage,
                getLocalStorageSize: getLocalStorageSize,
                keyboard: KeyboardSimulator

            }
        }()

        return Utils
});

function resetStorage() {
    localStorage.clear()
}
