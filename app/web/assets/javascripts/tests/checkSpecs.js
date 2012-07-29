define(['deps/jasmine/jasmine-html', 'utils/sync', 'utils/utils'], function(jasmine, WS, Utils) {
    // used by jasmine for asynchronous calls
    with(jasmine) {
        describe("socket and db are live", function() {

            it("socket is alive", function() {
                JasmineThread.fn = function() {
                    WS.connect().emit('tests/isAlive', function(arg) {
                        expect(arg).toEqual('alive')
                        JasmineThread.stop()
                    })
                }

                waitsFor(JasmineThread.run)
            })


            it("database is alive", function() {
                JasmineThread.fn = function() {
                    WS.connect().emit('tests/isDatabaseAlive', function(arg) {
                        expect(arg).toEqual('alive')
                        JasmineThread.stop()
                    })
                }

                waitsFor(JasmineThread.run)
            })

            it("localstorage is reset/empty", function() {
                Utils.clearLocalStorage()
                expect(Utils.getLocalStorageSize()).toEqual(0)
            })
        })
    }
})
