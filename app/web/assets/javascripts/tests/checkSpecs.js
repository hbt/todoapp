//define(['deps/jasmine/jasmine-html', 'utils/sync', 'utils/utils'], function(jasmine, WS, Utils) {
define(['deps/jasmine/jasmine-html', 'deps/jasmine/jasmine-flowcharts', 'utils/sync', 'utils/utils'], function(jasmine, JF, WS, Utils) {

    with(jasmine) {

        var specs = {
            '_summary': {
                _file: 'checkSpecs',
                _title: 'boot',
                _desc: 'Boot the app and run basic checks'
            },
            '// clear localstorage': function() {
                Utils.clearLocalStorage()
                expect(Utils.getLocalStorageSize()).toEqual(0)
            },
            'browser supports web sockets?': {
                n: 1,
                _f: {
                    'display error message': function() {

                    }
                }
            },
            'create socket connection': function() {
                JasmineThread.fn = function() {
                    WS.connect().emit('tests/isAlive', function(arg) {
                        expect(arg).toEqual('alive')
                        JasmineThread.stop()
                    })
                }

                waitsFor(JasmineThread.run)
            },
            '// mongodb checks': {
                'connect to mongo db': function() {
                    JasmineThread.fn = function() {
                        WS.connect().emit('tests/isDatabaseAlive', function(arg) {
                            expect(arg).toEqual('alive')
                            JasmineThread.stop()
                        })
                    }

                    waitsFor(JasmineThread.run)
                },
                'using test db -- not prod': function() {

                }

            }
        }

        JF.createSpecs(specs)
        JF.Graphiz.create(specs)
    }
})
