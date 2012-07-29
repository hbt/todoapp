define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks'], function(jasmine, Utils, TestUtils, Tasks) {

    with(jasmine) {
        describe("multi windows", function() {
            var iframe

            it("has more than one window open", function() {
                // shares the same local storage
                TestUtils.createNewTask('window AB new task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.at(0).get('_id')) {
                        var storageKeyId = AppConfig.genkey('').replace(AppConfig.prefix, '')
                        var href = window.location.href.replace(window.location.hash, '')
                        href += "#testWindow_" + storageKeyId

                        $('<iframe src="' + href + '" id="clone" width="1200" height="800"/>').appendTo('body');
                        $(document.getElementById('clone').contentDocument).ready(function() {
                            expect(true).toBeTruthy()
                            JasmineThread.stop()
                        });
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("share the same local storage", function() {
                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 1) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }
                waitsFor(JasmineThread.run)
            })

            it("a task is created when another window is open", function() {
                TestUtils.createNewTask('window A new task')

                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 2) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("task is updated from another window", function() {
                var newTitle = 'update window A'
                Tasks.at(0).save({
                    title: newTitle
                })

                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks .task-container').children(':first').find('.task-input').val() === newTitle) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("delete data in window A", function() {
                TestUtils.cleanTasks(this)
            })

            it("deleting a record in one window, deletes it in the other", function() {
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
