define(['deps/jasmine/jasmine-html', 'utils/sync', 'utils/utils'], function(jasmine, WS, Utils) {
    // used by jasmine for asynchronous calls
    with(jasmine) {
        describe("file: checkSpecs", function() {
            describe("boot app (sanity checks)", function() {
                it("we have an empty localstorage (clean tests)", function() {
                    Utils.clearLocalStorage()
                    expect(Utils.getLocalStorageSize()).toEqual(0)
                })

                it("we can establish a socket connection", function() {
                    JasmineThread.fn = function() {
                        WS.connect().emit('tests/isAlive', function(arg) {
                            expect(arg).toEqual('alive')
                            JasmineThread.stop()
                        })
                    }

                    waitsFor(JasmineThread.run)
                })

                it("user browser supports web sockets", function() {})
                it("user sees error message if web sockets are not supported", function() {})

                it("we can connect to the remote mongodb", function() {
                    JasmineThread.fn = function() {
                        WS.connect().emit('tests/isDatabaseAlive', function(arg) {
                            expect(arg).toEqual('alive')
                            JasmineThread.stop()
                        })
                    }

                    waitsFor(JasmineThread.run)
                })
            })

            describe("boot app (sanity checks)", function() {
                it("we can reconnect in case of a disconnect", function() {})
            })
        })
    }
})
