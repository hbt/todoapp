define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {

    TestUtils.beginTests()
    var iframe

    with(jasmine) {
        describe("User wants UI + data synchronized through all devices", function() {

            it("User has more than one device active", function() {
                expect(Tasks.length).toEqual(0)
                TestUtils.createNewTask('first task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.at(0) && Tasks.at(0).get('_id')) {
                        // create iframe
                        var href = window.location.href.replace(window.location.hash, '')
                        href += "?v=" + new Date()
                        href += "#testInstance_" + Auth.getUserId()
                        $('<iframe src="' + href + '" id="clone" width="1200" height="800"/>').appendTo('body');
                        $(document.getElementById('clone').contentDocument).ready(function() {
                            expect(true).toBeTruthy()
                            JasmineThread.stop()
                        });
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("User sees the same data on all devices", function() {

                JasmineThread.until(function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 1) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                })

                waitsFor(JasmineThread.run)
            })

            it("User creates a task on one device, task appears on the other", function() {
                TestUtils.createNewTask('new sync task')

                JasmineThread.fnuntil = function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 2) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("User edits a task on one device, changes appear on the other as he types", function() {
                Tasks.at(0).save({
                    title: 'update'
                })

                JasmineThread.fnuntil = function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks .task-container').children(':first').find('.task-input').val() === 'update') {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("(test): delete all data for test", function() {
                TestUtils.cleanTasks(this)
            })

            it("User deletes a record on one device, record disappears in the other", function() {
                JasmineThread.fnuntil = function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length == 0) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("(test): remove second device", function() {
                iframe = $(document.getElementById('clone'))
                iframe.remove()
                expect(document.getElementById('clone')).toBeNull()
            })

            TestUtils.endTests()
        })
    }
})
