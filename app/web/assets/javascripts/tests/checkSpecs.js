define(['deps/jasmine/jasmine-html', 'utils/sync'], function(jasmine, WS) {
    // used by jasmine for asynchronous calls
    var flag, value

    with(jasmine) {
        describe("basic remote checks", function() {

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
                localStorage.clear()
                expect(localStorage.length).toEqual(0)
            })
        })
    }
})
