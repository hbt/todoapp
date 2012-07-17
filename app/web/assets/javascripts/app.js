require.config({
    paths: {
        jquery: 'deps/jq',
        underscore: 'deps/underscore',
        socket: 'deps/socket.io',
        store: 'deps/backbone.localStorage',
        backbone: 'deps/backbone',
        mixins: 'utils/mixins',
        text: 'deps/require/text',
        templates: '../templates',
        handlebars: 'deps/handlebars',
        jasmine: 'deps/jasmine/jasmine'
    }
});

// r.js hack for minification
if (document) {
    // force cache reload when in dev (has no effect when in prod)
    requireConfiguration['urlArgs'] = "bust=v" + (new Date().getTime())
    require.config(requireConfiguration)
}

require(['jquery', 'utils/common_utils', 'utils/utils', 'utils/sync'], function($, CUtils, Utils, Sync) {
    Utils.initDebug()
    Sync.init()

    if(Utils.isDebugOn) {
        require(['tests/boot'], function(tests){
            tests.exec()
        })
    }
});
