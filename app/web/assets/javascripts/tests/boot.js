var taskTests = [
// new tasks
'tests/task/new',
// editing tasks
'tests/task/edit',
//// deleting tasks
//'tests/task/delete',
//// loading tasks
//'tests/task/list'
]


var tests = [
// check basics are working
'tests/checkSpecs',
// authentication
'tests/auth/register', taskTests,
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
                var nd = index + 1

                if (nd === tests.length) {
                    jasmineEnv.execute();
                    return;
                }

                require([tests[nd]], function() {
                    callback(nd)
                })
            }

            callback(-1)

            function replaceBodyWithResults() {
                if (replace) {
                    var html = (document.getElementById('HTMLReporter'))
                    document.body.innerHTML = ''
                    document.body.appendChild(html)
                }
            }

            setTimeout(replaceBodyWithResults, 1500)
        }

        return {
            exec: execJasmine
        }

    })();

    return boot
})
