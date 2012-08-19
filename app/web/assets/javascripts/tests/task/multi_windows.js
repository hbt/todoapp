define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks'], function(jasmine, Utils, TestUtils, Tasks) {

    TestUtils.beginTests()

    with(jasmine) {
        describe("User wants to see his changes synced across all open tabs/windows", function() {
            var iframe

            it("User has more than one window open", function() {
                // shares the same local storage
                expect(Tasks.length).toEqual(0)
                TestUtils.createNewTask('window AB new task')

                JasmineThread.fnuntil = function() {
                    if (Tasks.at(0).get('_id')) {
                        var storageKeyId = AppConfig.genkey('').replace(AppConfig.prefix, '')
                        var href = window.location.href.replace(window.location.hash, '')
                        href += "?v=" + new Date()
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

            it("Both windows share the same local storage", function() {
                JasmineThread.fnuntil = function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length === 1) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }
                waitsFor(JasmineThread.run)
            })

            it("User creates a task, task appears in second window", function() {
                TestUtils.createNewTask('window A new task')

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

            it("User edits a task, task is updated in second window", function() {
                var newTitle = 'update window A'
                Tasks.at(0).save({
                    title: newTitle
                })

                JasmineThread.fnuntil = function() {
                    if (!document.getElementById('clone')) return;
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks .task-container').children(':first').find('.task-input').val() === newTitle) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("(test): delete data in window A", function() {
                TestUtils.cleanTasks(this)
            })

            it("User deletes a task, task disappears in second window", function() {
                JasmineThread.fnuntil = function() {
                    iframe = $(document.getElementById('clone').contentDocument)
                    if (iframe.find('.all-tasks').children().length == 0) {
                        expect(true).toBeTruthy()
                        JasmineThread.stop()
                    }
                }

                waitsFor(JasmineThread.run)
            })

            it("(test): end of test", function() {
                iframe = $(document.getElementById('clone'))
                iframe.remove()
                expect(document.getElementById('clone')).toBeNull()
            })
        })
    }
})
