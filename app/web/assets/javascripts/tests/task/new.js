define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {

    with(jasmine) {
        describe("Tasks: new", function() {
            var task, oldtask, originalLength

            it("creates new task and saves locally", function() {
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

            it("saves remotely", function() {
                JasmineThread.fn = function() {
                    task.bind('remote_update', function() {
                        var diff = _.difference(_.values(this.toJSON()), _.values(oldtask))
                        // only difference is the new remote ID + userId
                        expect(diff.length).toEqual(2)
                        expect(this.get('_id').length).toEqual(24)
                        expect(this.get('userId')).toEqual(Auth.getUserId())
                        this.unbind('remote_update')
                        JasmineThread.stop()
                    }, task)
                }

                waitsFor(JasmineThread.run)
            })


            it("appears at the top of the view", function() {
                expect($('.all-tasks .task-container .task-input').val()).toEqual(task.get('title'))
            })

            it("doesn't create a task if title is empty", function() {
                TestUtils.createNewTask('')
                var el = $('.first-input .task-input')
                expect(Tasks.length).toEqual(originalLength + 1)

                TestUtils.createNewTask('   ')
                expect(Tasks.length).toEqual(originalLength + 1)
            })

            describe("focus removed", function() {
                // input is cleared on blur
                it("clears the input", function() {
                    var el = $('.first-input .task-input')
                    el.focus()
                    Utils.keyboard.simulateTyping('something random')
                    el.blur()

                    expect(Tasks.length).toEqual(originalLength + 1)
                    expect(el.val()).toEqual('')
                })

                it("waits a few seconds before clearing the input", function() {
                    // TODO(hbt): wait 5000 then clear the input and make sure input has no changed. if clicked, it cancels the timer
                })
            })

            it("end of test", function() {
                TestUtils.cleanTasks(this)
            })

        })
    }
})
