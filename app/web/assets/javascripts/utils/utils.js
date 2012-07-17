define(['jquery'], function($) {
    var Utils = function() {
            // turn this off on production
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

                                    data = parseInt(data.responseText, 10)

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

            return {
                initDebug: initializeDebugMode,
                isDebugOn: DEBUG
            }
        }()

        return Utils
});

function resetStorage() {
    localStorage.clear()
}