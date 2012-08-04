define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {

    with(jasmine) {
        describe("First time, Anonymous", function() {

        })


        describe("Click google login", function() {
            it("Fake data is created", function() {})
            it("User is redirected to google login, accepts and token is returned", function() {})
            it("retrieves + stores user id using token parameter", function() {})
            it("login using google info", function() {})
            it("Anonymous is not displayed, actual name is used", function() {})
            it("Data from anonymous user is moved to logged in user", function() {})
            it("Data is fetched", function() {})
        })

        describe("logout", function() {
            it("clears local storage", function() {})
        })


        describe("logs back in", function() {
            it("has all remote data", function() {})
        })

        describe("end of test", function() {
            it("clears local storage", function() {})
            it("creates anonymous for remaining tests", function() {})
            it("end of test", function() {})
        })
    }
})
