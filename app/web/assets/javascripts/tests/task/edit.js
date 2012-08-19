define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'utils/sync'], function(jasmine, Utils, TestUtils, Tasks, Auth, Sync) {

    TestUtils.beginTests()

    var task
    with(jasmine) {
        describe("User edits a task", function() {

            it("(test) init data", function() {
                TestUtils.createNewTask('first edit task')
                TestUtils.createNewTask('second edit task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.pluck('_id').length === 2) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("we save as the user types", function() {
                // focus on edit
                var el = $('.all-tasks .task-container .task-input').first()
                el.focus()

                task = Tasks.at(0)

                var count = 0
                var sync = function(model, obj, attrs) {
                        if (_.include(['second edit task', 'u', 'up'], this.get('title'))) {
                            count++
                        }
                    }
                task.bind('sync', sync, task)

                var title = 'up'
                el.val('')
                Utils.keyboard.simulateTyping(title, "keyup", true)

                // saves locally as you type
                expect(task.get('title')).toEqual(title)
                expect(el.val()).toEqual(title)

                // saves remotely as you type
                // will sync every typed key
                JasmineThread.fnuntil = function() {
                    if (count === 3) {
                        task.unbind('sync', sync)
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("user can toggle between done and undone", function() {
                expect(task.get('done')).toBeFalsy()
                var el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeTruthy()

                el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeFalsy()
            })



            describe("watch for", function() {
                it("title has a limit of characters", function() {})
                it("we don't save empty task when using backspace", function() {})

                describe("user has a slow connection", function() {
                    it("we don't update local data when remote data is too old", function() {
                        var v = Tasks.at(0).get('updatedAt')
                        var nv = (new Date().getTime() - 500000)
                        Tasks.at(0).save({
                            updatedAt: nv
                        }, {
                            skip_remote: true
                        })

                        expect(Tasks.at(0).get('updatedAt')).toEqual(v)
                    })
                })

                describe("data in the collection is tied to the data in the UI", function() {

                    it("if we update an object in the collection, view associated to the object is updated", function() {
                        Tasks.at(0).save({
                            title: 'up2'
                        })
                        var el = $('.all-tasks .task-container .task-input').first()
                        expect(el.val()).toEqual('up2')
                    })

                    it("if we silently update an object in the collection, view associated to the object is not updated", function() {
                        Tasks.at(0).save({
                            title: 'u3'
                        }, {
                            silent: true
                        })
                        var el = $('.all-tasks .task-container .task-input').first()
                        expect(el.val()).toEqual('up2')
                    })
                })
            })

            TestUtils.endTests()
        })
    }
})
