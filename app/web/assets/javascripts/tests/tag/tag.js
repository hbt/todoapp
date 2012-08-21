define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'utils/sync'], function(jasmine, Utils, TestUtils, Tasks, Auth, Sync) {

    TestUtils.beginTests()

    with(jasmine) {
        describe("file: tag/tag", function() {
            describe("User can tag a task", function() {
                    it("User edits task and tags are created as he types using #", function(){})
                    it("User sees tags next to task being created on the fly", function(){})
                    it("User sees tags in tag list container being created/updated", function(){})
                    it("User edits another task with similar tags and the count in the tag list is updated", function(){})

                describe("watch out for", function() {
                    it("tags are in lower case, alphanumeric only with the exception of '-' and '_' and separated by spaces", function(){})
                })
            })

            describe("User sees a list of tags with the count of tasks associated to them", function() {
                it("User does not see the tag if the count is 0", function(){})
            })
        })
    }
})
