define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'backbone', 'utils/sync'], function(jasmine, Utils, TestUtils, Tasks, Auth, Backbone, WS) {

    function runAnonymousSpecs() {
        var userInfo

        with(jasmine) {
            it("we create an anonymous account", function() {
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


            it("we track the login time and user account information is stored locally", function() {
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


            it("user sees 'Anonymous' as a username", function() {})
            }
    }

    with(jasmine) {
        describe("Authentication", function() {

            describe("we login user based on information in local storage", function() {
                it("we do not have any information, we boot the app assuming user wants to use it anonymously", function() {
                    expect(Auth.getUserId()).toBe(null)
                    expect(Auth.getUserInfo()).toBe(null)
                })

                describe("Anonymous account", runAnonymousSpecs)
            })

            describe("User enters data using anonymous account", function() {
                it("we save the data locally and remotely", function() {
                    // create 2 local tasks for anonymous
                    Tasks.create({
                        title: "ff"
                    })
                    Tasks.create({
                        title: "ss"
                    })

                    // continue when all fake tasks have been remotely created
                    JasmineThread.fnuntil = function() {
                        if (Tasks.pluck('_id').length === 2) {
                            JasmineThread.stop()
                        }
                    }

                    waitsFor(JasmineThread.run)
                })
            })


            describe("User clicks google login icon", function() {

                var googleUser = null
                it("we redirect user to google | user accepts App | google redirects to app server | google account info is stored | app server redirects to index.html", function() {
                    // create google user
                    var gid = Utils.genUniqId()
                    var email = 'test_jasmine' + Utils.genUniqId() + '@gmail.com'
                    var json ={
                        "scopedUsers":{},
                        "user":{
                            "id": gid,
                            "email": email,
                            "verified_email":true,
                            "name":"Test Jasmine",
                            "given_name":"Test",
                            "family_name":"Jasmine",
                            "link":"https://plus.google.com/103018688350089292120",
                            "gender":"male",
                            "locale":"en"
                        }
                    };

                    JasmineThread.fn = function() {
                        WS.connect().emit('auth/googleLogin', json, function(user) {
                            googleUser = user
                            expect(user.email).toEqual(email)
                            JasmineThread.stop()
                        })
                    }

                    waitsFor(JasmineThread.run)
                })

                it("we login user based on information in local storage", function() {
                    // call login routine
                    Auth.googleLogin(googleUser.id, googleUser.createdAt)

                    JasmineThread.fnuntil = function() {
                        if(Auth.getUserId() === googleUser.id) {
                            expect(true).toBeTruthy()
                            JasmineThread.stop()
                        }
                    }
                    waitsFor(JasmineThread.run)
                })

                it("user data entered as anonymous now belongs to his google account", function() {
                    JasmineThread.fnuntil = function() {
                        // migration completed
                        if(_.unique(Tasks.pluck('userId'))[0] === googleUser.id) {
                            expect(true).toBeTruthy()
                            JasmineThread.stop()
                        }
                    }
                    waitsFor(JasmineThread.run)
                })

                it("user can see his first name instead of 'Anonymous'", function() {})
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
                it("(test): end of test", function() {
                    // clear localstorage
                    TestUtils.cleanTasks(this)
                })

                it("(test): clear storage to login as anonymous", function() {
                    Utils.clearLocalStorage()
                    expect(Utils.getLocalStorageSize()).toEqual(0)
                    expect(Tasks.length).toEqual(0)
                })
            })

            describe("First time, Anonymous", runAnonymousSpecs)
        })
        }
})
