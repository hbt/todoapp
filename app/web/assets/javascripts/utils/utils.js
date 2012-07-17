var c = console
c.l = console.log
c.d = console.dir

define(['jquery'], function($) {
    var Utils = function() {
            // turn this off on production
            var DEBUG = 1

            function initializeDebugMode() {
                $('#debug').show()
                if (DEBUG) {
                    var version = -1
                    $(function() {
                        setInterval(function() {
                            $.ajax({
                                url: '/version.txt',
                                dataType: 'script',
                                complete: function(data) {
                                    if (data.status == 304) console.log('not working -- caching issue');

                                    data = data.responseText
                                    if (version == -1) version = eval(data)

                                    if (version < eval(data)) {
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
