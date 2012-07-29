define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {
    var iframe

    with(jasmine) {
        describe("multi devices", function() {

            it("has more than one device active", function() {
                TestUtils.createNewTask('first task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.at(0).get('_id')) {
                        // create iframe
                        var href = window.location.href.replace(window.location.hash, '')
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

            it("multiple devices share the same data", function() {

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

            it("creating a record in one window, adds it to the other", function() {
                TestUtils.createNewTask('new sync task')

                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 2) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("updating a record in one device, updates it in the other", function() {
                Tasks.at(0).save({
                    title: 'update'
                })

                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks .task-container').children(':first').find('.task-input').val() === 'update') {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("delete all data for test", function() {
                TestUtils.cleanTasks(this)
            })

            it("deleting a record in one device, deletes it in the other", function() {
                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length == 0) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("end of test", function() {
                iframe = $(document.getElementById('clone'))
                iframe.remove()
                expect(document.getElementById('clone')).toBeNull()
            })
        })
    }
})
