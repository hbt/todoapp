define(['jquery', 'backbone'], function($, Backbone, HB, tmpltxt) {
    var GlobalRouting = Backbone.Router.extend({
        routes: {
            "devtests": "runTests"
        },

        runTests: function() {
            window.DEBUG = 1
            require(['tests/boot'], function(tests) {
                tests.exec()
            })
        }
    })

    //        var w = new Workspace()
    //Backbone.history.start()
    //w.navigate("help", {trigger: true, replace: false})
    //w.navigate("devtests", {trigger: true, replace: false})
    return GlobalRouting
})
