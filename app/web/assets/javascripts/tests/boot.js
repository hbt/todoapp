var taskTests = [
//
'tests/task/new',
//
'tests/task/list',
//
'tests/task/edit',
//
'tests/task/delete',
//
]

var taskExtras = [
//
'tests/task/multi_devices',
//
'tests/task/multi_windows',
//
]

var tests = [
// check basics are working
'tests/checkSpecs',
// test google login + anonymous usage
'tests/auth/login',
// 
taskTests,
//
taskExtras,
// take down
'tests/auth/logout'
// next here
]

tests = _.flatten(tests)

define(['deps/jasmine/jasmine-html'], function(jasmine) {
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

            // hack to load tests in order 

            function callback(index) {
                if (index === tests.length) {
                    jasmineEnv.execute();
                    return;
                }

                require([tests[index]], function() {
                    callback((index + 1))
                })
            }

            callback(0)
        }

        return {
            exec: execJasmine
        }

    })();

    return boot
})
