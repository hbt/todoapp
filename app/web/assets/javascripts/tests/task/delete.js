define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks'], function(jasmine, Utils, TestUtils, Tasks) {
    TestUtils.beginTests()
    with(jasmine) {
        describe("User deletes a task", function() {

            it("init data", function() {
                TestUtils.createNewTask('first task delete')
                expect(Tasks.length).toEqual(1)
            })

            describe("we delete the task", function() {
                describe("when user", function() {
                    it("presses backspace and the title is empty", function() {})
                    it("presses hotkey associated to delete action", function() {})
                    it("clicks delete button", function() {})
                })
                it("when title is empty and focus is removed (with a delay same as new)", function() {})
            })

            it("user sees a confirmation before we delete the task", function() {})

            describe("after user deletes a task", function() {
                it("we enable the undo button", function() {})
                it("if user presses undo, we restore the task", function() {})
            })

            describe("watch for soft delete", function() {
                describe("when user deletes a task", function() {
                    it("we mark it as deleted (deletedAt)", function() {
                        var id = Tasks.at(0).get('id')
                        var length = Tasks.length
                        var time = +new Date()
                        Tasks.at(0).destroy()

                        expect(Tasks.length).toEqual(0)
                    })

                    it("we don't remove it from local storage", function() {})

                    it("user can see the task disappear", function() {
                        expect($('.all-tasks').children().length).toEqual(0)
                    })

                    it("upon fetch, we don't display deleted tasks", function() {
                        Tasks.fetch()
                        expect($('.all-tasks').children().length).toEqual(0)
                    })

                    it("we don't store deleted tasks in the collection", function() {})
                })
            })
        })
    }
})
