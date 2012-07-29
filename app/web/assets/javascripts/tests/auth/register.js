define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {

    with(jasmine) {
        describe("Account creation", function() {

            it("anonymous account is created", function() {
                expect(Auth.getUserId()).toBe(null)
                expect(Auth.getUserInfo()).toBe(null)

                JasmineThread.fn = function() {
                    Auth.login(function() {
                        expect(Auth.getUserId()).toNotBe(null)
                        expect(Auth.getUserInfo()).toNotBe(null)
                        expect(Auth.getUserId()).toEqual(Auth.getUserInfo().id)
                        expect(Auth.getUserInfo().loggedAt.length).toEqual(1)
                        userInfo = Auth.getUserInfo()
                        JasmineThread.stop()
                    })
                }

                waitsFor(JasmineThread.run)
            })


            it("login time is tracked and account is updated", function() {
                JasmineThread.fn = function() {
                    Auth.login(function() {
                        expect(Auth.getUserInfo().loggedAt.length).toEqual(2)
                        expect(Auth.getUserInfo().id).toEqual(userInfo.id)
                        expect(Auth.getUserInfo()._id).toEqual(userInfo._id)
                        expect(Auth.getUserInfo().updatedAt).toBeGreaterThan(userInfo.updatedAt)
                        JasmineThread.stop()
                    })
                }
                waitsFor(JasmineThread.run)
            })
        })
    }
})
