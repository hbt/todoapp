define(['jquery', 'backbone'], function($, Backbone, HB, tmpltxt) {
    var GlobalRouting = Backbone.Router.extend({
        routes: {
            "devtests": "runTests",
            "devtests/:spec": "runTests",
            "googleLogin/:id/:createdAt": "googleLogin"
        },

        runTests: function(spec) {
            if (spec) {
                spec = decodeURIComponent(spec)
                window.testFilename = 'tests/' + spec.replace('spec=file: ', '')
            }
            window.DEBUG = 1
            require(['tests/boot'], function(tests) {
                tests.exec()
            })
        },

        googleLogin: function(id, createdAt) {
            require(['modules/authentication'], function(Auth) {
                Auth.googleLogin(id, createdAt)
            })
        }
    })
    
    return GlobalRouting
})
