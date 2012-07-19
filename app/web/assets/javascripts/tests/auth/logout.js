define(['deps/jasmine/jasmine-html', 'modules/authentication', 'utils/utils'], function(jasmine, Auth, Utils) {
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
                    expect(Utils.getLocalStorageSize()).toEqual(0)
                })
            })
        })
    }
})
