define(['deps/jasmine/jasmine-html',  'deps/jasmine/jasmine-flowcharts', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'backbone', 'utils/sync'], function(jasmine, JF, Utils, TestUtils, Tasks, Auth, Backbone, WS) {


    TestUtils.endTests()

    with(jasmine) {

        var userInfo
   
        var specs = {
            '_summary': {
                _file: 'auth/login',
                _title: 'auto-login',
                _desc: 'App is immediately usable as Anonymous. User can optionally login using google'
            },

            'has account?': {
                'create anonymous account': {
                    _f:  function() {
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
                    }
                },
                '// track login time + store user info locally': function() {
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
                },
                '// fill some data as anonymous for later migration': function() {
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
                },
                'authenticate': function() {}
            },
            'authenticate': function() {},
            'is Google account?': {
                'display `Welcome Anonymous`': function() {},
                'clicks login with google?': {},
                "allow app to use google Info": null,
                "google redirects to backend server": null,
                "backend server stores google info": function() {
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
                },
                "backend server redirects to App": function() {
                    // call login routine
                    Auth.googleLogin(googleUser.id, googleUser.createdAt)

                    JasmineThread.fnuntil = function() {
                        if (Auth.getUserId() === googleUser.id) {
                            expect(true).toBeTruthy()
                            JasmineThread.stop()
                        }
                    }
                    waitsFor(JasmineThread.run)
                },
                "has account?": null
            },
            'display `Welcome first name`': function() {},
            "had data as Anonymous?": {},
            "migrate data from anonymous to Google": function() {
                JasmineThread.fnuntil = function() {
                    // migration completed
                    if (_.unique(Tasks.pluck('userId'))[0] === googleUser.id) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }
                waitsFor(JasmineThread.run)
            }
        }
        JF.createSpecs(specs)
        }
})
