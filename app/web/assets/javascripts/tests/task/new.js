define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {

    TestUtils.beginTests()

    with(jasmine) {
        describe("User creates new task", function() {
            var task, oldtask, originalLength

            it("we save the task locally", function() {
                originalLength = Tasks.length
                var title = 'new task '

                TestUtils.createNewTask(title)
                var el = $('.first-input .task-input')

                // data is saved
                var timestamp = +new Date() + 5
                task = Tasks.at(0)
                oldtask = _.clone(task.toJSON())
                expect(task.get('title')).toEqual(title.trim())
                expect(task.get('createdAt')).toBeLessThan(timestamp)
                expect(task.get('updatedAt')).toBeLessThan(timestamp)
                expect(task.get('done')).toEqual(false)
                expect(task.get('id').length).toEqual(36)

                // input is cleared
                expect(el.val().length).toEqual(0)
            })

            it("we save the task remotely", function() {
                JasmineThread.fnuntil = function() {
                    var diff = _.difference(_.values(task.toJSON()), _.values(oldtask))
                    if (diff.length === 3) {
                        // only difference is the new remote ID + userId
                        expect(task.get('_id').length).toEqual(24)
                        expect(task.get('userId')).toEqual(Auth.getUserId())
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })


            it("user sees task at the top of the view", function() {
                expect($('.all-tasks .task-container .task-input').val()).toEqual(task.get('title'))
            })

            describe("watch out for", function() {
                it("we don't create a task if title is empty", function() {
                    TestUtils.createNewTask('')
                    var el = $('.first-input .task-input')
                    expect(Tasks.length).toEqual(originalLength + 1)

                    TestUtils.createNewTask('   ')
                    expect(Tasks.length).toEqual(originalLength + 1)
                })
            })

            describe("User removes focus from input", function() {
                // input is cleared on blur
                it("we clear the input", function() {
                    var el = $('.first-input .task-input')
                    el.focus()
                    Utils.keyboard.simulateTyping('something random')
                    el.blur()

                    expect(Tasks.length).toEqual(originalLength + 1)
                    expect(el.val()).toEqual('')
                })

                it("we wait a few seconds before clearing the input", function() {
                    // TODO(hbt): wait 5000 then clear the input and make sure input has no changed. if clicked, it cancels the timer
                })
            })
        })
    }
})
