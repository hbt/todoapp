define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks'], function(jasmine, Utils, TestUtils, Tasks) {
    with(jasmine) {
        describe("Tasks: delete", function() {

            it("init data", function() {
                TestUtils.createNewTask('first task delete')
                expect(Tasks.length).toEqual(1)
            })

            it("when pressing backspace and the title is empty", function() {})
            it("when pressing hotkey", function() {})
            it("when title is empty and focus is removed", function() {})
            it("when clicking delete button", function() {})
            it("shows confirmation before deleting", function() {})

            describe("undo", function() {
                it("undo button is enabled after deleting", function() {})
                it("pressing undo button restores the task", function() {})
            })

            describe("watch for", function() {
                describe("soft delete", function() {
                    it("deleting a record, marks it as deleted (deletedAt)", function() {
                        var id = Tasks.at(0).get('id')
                        var length = Tasks.length
                        var time = +new Date()
                        Tasks.at(0).destroy()

                        expect(Tasks.length).toEqual(0)
                    })

                    it("deleting a record, doesn't remove it from local storage", function() {})

                    it("deleting a record, destroys the view associated to it", function() {
                        expect($('.all-tasks').children().length).toEqual(0)
                    })

                    it("UI ignores deleted records on fetch", function() {
                        Tasks.fetch()
                        expect($('.all-tasks').children().length).toEqual(0)
                    })

                    it("Collection doesn't contain deleted tasks", function() {})

                    it("end of test", function() {
                        TestUtils.cleanTasks(this)
                    })
                })
            })
        })
    }
})
