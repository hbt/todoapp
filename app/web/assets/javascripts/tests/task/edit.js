define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication', 'utils/sync'], function(jasmine, Utils, TestUtils, Tasks, Auth, Sync) {

    TestUtils.beginTests()

    var task
    with(jasmine) {
        describe("Tasks: edit", function() {

            it("saves as you type", function() {
                TestUtils.createNewTask('first edit task')
                TestUtils.createNewTask('second edit task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.pluck('_id').length === 2) {
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("saves as you type", function() {
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

            it("can toggle done", function() {
                expect(task.get('done')).toBeFalsy()
                var el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeTruthy()

                el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeFalsy()
            })

            it("title has a limit of characters", function() {})

            it("doesn't save empty when using backspace", function() {})

            describe("watch for", function() {
                describe("slow connections", function() {
                    it("doesn't update local objects when remote objects are too old", function() {
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

                describe("model is tied to the view", function() {

                    it("updating object, updates model", function() {
                        Tasks.at(0).save({
                            title: 'up2'
                        })
                        var el = $('.all-tasks .task-container .task-input').first()
                        expect(el.val()).toEqual('up2')
                    })

                    it("updating object silently does not update model", function() {
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
