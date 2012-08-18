define(['deps/jasmine/jasmine-html', 'modules/authentication', 'utils/utils'], function(jasmine, Auth, Utils) {
    var flag, value


    with(jasmine) {
        describe("User clicks logout", function() {
            it("we display confirmation message", function() {})
            describe("if user confirms", function() {
                it("we clear all data in local storage", function() {})
                it("we disconnect the web socket", function() {})
                it("we clear everything and display a message that the user is logged out and must reload the page", function() {})
            })
        })

        describe("logout", function() {
            // TODO(hbt): remove data after test

            //            it("test data is removed", function() {
            //                flag = false
            //                runs(function() {
            //                    Auth.logout(function(info) {
            //                        expect(info).toEqual('removed')
            //                        flag = true
            //                    })
            //                })
            //
            //                waitsFor(function() {
            //                    return flag
            //                }, 1000)
            //
            //                runs(function() {
            //                    setTimeout(Utils.clearLocalStorage, 3000)
            //                })
            //            })
        })
    }
})
