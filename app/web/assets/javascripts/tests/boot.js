var tests = ['deps/jasmine/jasmine-html',
// check basics are working
'tests/checkSpecs',
// authentication
'tests/auth/register',
// take down
'tests/auth/logout'
// next here
]
define(tests, function(jasmine) {
    jasmine = jasmine.jasmine
    var boot = (function() {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };

        function execJasmine() {
            jasmineEnv.execute();
        }

        return {
            exec: execJasmine
        }

    })();

    return boot
})
