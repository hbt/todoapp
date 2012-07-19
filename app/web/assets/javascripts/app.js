require.config({
    paths: {
        jquery: 'deps/jquery/jq',
        underscore: 'deps/underscore',
        socket: 'deps/socket.io',
        store: 'deps/backbone.localStorage',
        backbone: 'deps/backbone',
        mixins: 'utils/mixins',
        text: 'deps/require/text',
        templates: '../templates',
        handlebars: 'deps/handlebars',
        jasmine: 'deps/jasmine/jasmine',
        extendjs: 'utils/extend'
    }
});

// r.js hack for minification
if (document) {
    // force cache reload when in dev (has no effect when in prod)
    requireConfiguration['urlArgs'] = "bust=v" + (new Date().getTime())
    require.config(requireConfiguration)
}

require(['jquery', 'config', 'utils/common_utils', 'utils/utils', 'utils/sync', 'modules/authentication', 'extendjs'], function($, Config, CUtils, Utils, Sync, Auth) {
    Utils.initDebug()

    if (Utils.inTestMode()) {
        require(['tests/boot'], function(tests) {
            tests.exec()
        })
    } else {
        Auth.login()
    }
});
