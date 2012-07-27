define(['deps/jasmine/jasmine-html', 'utils/sync', 'utils/utils'], function(jasmine, WS, Utils) {
    // used by jasmine for asynchronous calls
    var flag, value

    with(jasmine) {
        describe("socket and db are live", function() {

            it("socket is alive", function() {
                runs(function() {
                    flag = false
                    WS.connect().emit('tests/isAlive', function(arg) {
                        value = arg
                        flag = true
                    })
                })

                waitsFor(function() {
                    return flag
                }, 1000)

                runs(function() {
                    expect(value).toEqual('alive')
                })
            })


            it("database is alive", function() {

                runs(function() {
                    flag = false
                    WS.connect().emit('tests/isDatabaseAlive', function(arg) {
                        value = arg
                        flag = true
                    })
                })

                waitsFor(function() {
                    return flag
                }, 1000)

                runs(function() {
                    expect(value).toEqual('alive')
                })
            })

            it("localstorage is reset/empty", function() {
                Utils.clearLocalStorage()
                expect(Utils.getLocalStorageSize()).toEqual(0)
            })
        })
    }
})
