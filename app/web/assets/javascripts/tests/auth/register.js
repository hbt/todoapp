define(['deps/jasmine/jasmine-html', 'modules/authentication'], function(jasmine, Auth) {
    var flag, value, userInfo


    with(jasmine) {
        describe("Account creation", function() {

            it("anonymous account is created", function() {
                expect(Auth.getUserId()).toBe(null)
                expect(Auth.getUserInfo()).toBe(null)

                runs(function() {
                    flag = false
                    Auth.login(function() {
                        flag = true
                    })
                })

                waitsFor(function() {
                    return flag
                }, 1000)

                runs(function() {
                    expect(Auth.getUserId()).toNotBe(null)
                    expect(Auth.getUserInfo()).toNotBe(null)
                    expect(Auth.getUserId()).toEqual(Auth.getUserInfo().id)
                    expect(Auth.getUserInfo().loggedAt.length).toEqual(1)
                    userInfo = Auth.getUserInfo()
                })
            })


            it("login time is tracked and account is updated", function() {
                runs(function() {
                    flag = false
                    Auth.login(function() {
                        flag = true
                    })
                })

                waitsFor(function() {
                    return flag
                }, 1000)

                runs(function() {
                    expect(Auth.getUserInfo().loggedAt.length).toEqual(2)
                    expect(Auth.getUserInfo().id).toEqual(userInfo.id)
                    expect(Auth.getUserInfo()._id).toEqual(userInfo._id)
                    expect(Auth.getUserInfo().updatedAt).toBeGreaterThan(userInfo.updatedAt)
                })
            })
        })
        }
})
