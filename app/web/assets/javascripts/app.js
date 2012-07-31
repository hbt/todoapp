require.config({
    // https://github.com/jrburke/require-jquery
    //      shim: {
    //        'deps/jquery/jquery.send.keys': {
    //            deps: ['jquery'],
    //            exports: 'jQuery.fn.sendkeys'
    //        }
    ////        'jquery.scroll': {
    ////            deps: ['jquery'],
    ////            exports: 'jQuery.fn.scroll'
    ////        },
    //    },
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
        jasmine: 'deps/jasmine/jasmine'
    }
});

// r.js hack for minification
if (document) {
    // force cache reload when in dev (has no effect when in prod)
    requireConfiguration['urlArgs'] = "bust=v" + (new Date().getTime())
    require.config(requireConfiguration)
}

require(['jquery', 'utils/common_utils', 'utils/utils', 'utils/sync', 'modules/authentication',
// global stuff
'utils/extend', 'config'], function($, CUtils, Utils, Sync, Auth) {
    Utils.initDebug()
    Sync.init()
    Auth.login()

    // TODO(hbt) check if this works in min. Otherwise, require it here first and clean up require code in list,app,edit
    require(['views/app'], function(AppView) {
        new AppView()

        //    require(['tests/utils/testUtils'], function(TestUtils) {
        //                TestUtils.createNewTask('wwe')
        //    })
        if (AppConfig.inTestMode()) {
            require(['tests/boot'], function(tests) {
                tests.exec(window.location.hash === "#tests")
            })
        }
    })

});
