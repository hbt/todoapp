define(['deps/jasmine/jasmine-html', 'modules/authentication'], function(jasmine, Auth) {
    var flag, value


    with(jasmine) {
        describe("logout", function() {

            it("localstorage is cleared", function() {
                runs(function() {
                    flag = false
                    Auth.logout(function(info) {
                        expect(info).toEqual('removed')
                        flag = true
                    })
                })

                waitsFor(function() {
                    return flag
                }, 1000)

                runs(function() {
                    expect(localStorage.length).toEqual(0)
                })
            })
        })
    }
})
