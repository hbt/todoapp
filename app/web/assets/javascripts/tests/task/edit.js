define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {
    var task

    with(jasmine) {
        describe("Edit Tasks", function() {

            it("saves as you type", function() {
                TestUtils.createNewTask('first task')
                TestUtils.createNewTask('second task')

                // focus on edit
                var el = $('.all-tasks .task-container .task-input').first()
                el.focus()

                task = Tasks.at(0)

                var title = 'up'
                Utils.keyboard.simulateTyping(title)

                // saves locally as you type
                expect(task.get('title')).toEqual(title)
                expect(el.val()).toEqual(title)

                // saves remotely as you type
                var sync = function(model, obj, attrs) {
                        expect(_.include(['second task', 'u', 'up'], this.get('title'))).toBeTruthy()
                        this.unbind('sync', sync)
                        JasmineThread.stop()
                    }

                JasmineThread.fn = function() {
                    task.bind('sync', sync, task)
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

                    it("end of test", function() {
                        // restore it
                        Tasks.at(0).save({
                            title: 'up'
                        })
                        var el = $('.all-tasks .task-container .task-input').first()
                        expect(el.val()).toEqual('up')
                    })
                })

                it("doesn't save empty when using backspace", function() {})
            })
        })
    }
})
