var taskTests = [
// loading tasks
'tests/task/list', 'tests/task/new', 'tests/task/edit', 'tests/task/delete', ]

var taskExtras = [
// multi-devices
'tests/task/multi_devices']

var tests = [
// check basics are working
'tests/checkSpecs',
// authentication
'tests/auth/register', taskTests, taskExtras,
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

        function execJasmine(replace) {

            // hack to load tests in order 

            function callback(index) {
                if (index === tests.length) {
                    jasmineEnv.execute();
                    setTimeout(replaceBodyWithResults, 1500)
                    return;
                }

                require([tests[index]], function() {
                    callback((index + 1))
                })
            }

            callback(0)

            function replaceBodyWithResults() {
                if (replace) {
                    var html = (document.getElementById('HTMLReporter'))
                    document.body.innerHTML = ''
                    document.body.appendChild(html)
                }
            }

        }

        return {
            exec: execJasmine
        }

    })();

    return boot
})
