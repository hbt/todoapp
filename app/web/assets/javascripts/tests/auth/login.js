define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'backbone', 'utils/sync'], function(jasmine, Utils, TestUtils, Tasks, Auth, Backbone, WS) {

    TestUtils.endTests()

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
        }
    }

    function runGoogleSpecs() {
        with(jasmine) {

            var googleUser = null
            it("we redirect user to google | user accepts App | google redirects to app server | google account info is stored | app server redirects to index.html", function() {
                // create google user
                var gid = Utils.genUniqId()
                var email = 'test_jasmine' + Utils.genUniqId() + '@gmail.com'
                var json = {
                    "scopedUsers": {},
                    "user": {
                        "id": gid,
                        "email": email,
                        "verified_email": true,
                        "name": "Test Jasmine",
                        "given_name": "Test",
                        "family_name": "Jasmine",
                        "link": "https://plus.google.com/103018688350089292120",
                        "gender": "male",
                        "locale": "en"
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

            it("we login user based on information (google data) in parameters -- routing", function() {
                // call login routine
                Auth.googleLogin(googleUser.id, googleUser.createdAt)

                JasmineThread.fnuntil = function() {
                    if (Auth.getUserId() === googleUser.id) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }
                waitsFor(JasmineThread.run)
            })

            it("we migrate user data entered as anonymous to his google account", function() {
                JasmineThread.fnuntil = function() {
                    // migration completed
                    if (_.unique(Tasks.pluck('userId'))[0] === googleUser.id) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }
                waitsFor(JasmineThread.run)
            })

            it("user sees his first name instead of 'Anonymous'", function() {})
        }
    }

    with(jasmine) {
        describe("Authentication", function() {

            describe("we login user based on information in local storage", function() {
                describe("if we do not have any information", function() {
                    it("we boot the app assuming user wants to use it anonymously", function() {
                        expect(Auth.getUserId()).toBe(null)
                        expect(Auth.getUserInfo()).toBe(null)
                    })
                    describe("Anonymous account", runAnonymousSpecs)
                })
            })

            describe("User clicks google login icon", runGoogleSpecs)

            TestUtils.endTests()
        })
    }
})
