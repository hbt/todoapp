define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'backbone'], function(jasmine, Utils, TestUtils, Tasks, Auth, Backbone) {

    function runAnonymousSpecs() {
        with(jasmine) {
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


            it("Anonymous is displayed as username", function() {})
        }
    }

    with(jasmine) {
        describe("First time, Anonymous", runAnonymousSpecs)

        describe("Click google login", function() {
            it("Fake data is created", function() {
                // create 2 local tasks for anonymous

                // create 1 remote

                // continue when all fake tasks have been remotely created
            })

            it("User is redirected to google login, accepts and token is returned", function() {
                // simulate user login

                // create test user

                // set token parameter
            })

            it("retrieves + stores user id using token parameter", function() {
                // back up anonymous user id

                // call login

                // check user id is now different
            })

            it("login using google info", function() {
                // login

                // check user-info matches
            })
            it("Anonymous is not displayed, actual name is used", function() {})
            it("Data from anonymous user is moved to logged in user", function() {
                // check fake tasks associated to anonymous now belong to test user
            })
        })

        describe("logout", function() {
            it("clears local storage", function() {
                // bak user id 

                // clear everything
            })
        })


        describe("logs back in", function() {
            it("Data is fetched", function() {
                // simulate login

                // check data is fetched
            })
            it("end of test", function() {
                // clear everything
            })
        })

        //        describe("First time, Anonymous", runAnonymousSpecs)
    }
})
