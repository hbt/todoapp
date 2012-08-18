define(['jquery', 'utils/utils', 'collections/tasks', 'utils/sync', 'deps/jasmine/jasmine-html', 'modules/authentication'], function($, Utils, Tasks, Sync, jasmine, Auth) {
    var TestUtils = {
        createNewTask: function(title) {
            var el = $('.first-input .task-input')
            el.focus()
            title += "\r\n"
            Utils.keyboard.simulateTyping(title)
        },

        // TODO(hbt): refactor calls and remove jasmine (use jasmine from requirejs instead of the passed as a parameter)
        cleanTasks: function(jasmine, callback) {

            Tasks.fetch({
                include_deleted: true,
                skip_remote: true
            })
            JasmineThread.fnuntil = function() {
                Tasks.destroyAll({
                    force: true
                })
                var valid = (Tasks.length === 0 && $('.all-tasks .task-container').children().length === 0)
                if (valid && Sync.callbacksCount === 0) {
                    jasmine.expect(true).toBeTruthy()
                    if (callback) callback()
                    JasmineThread.stop()
                }
            }

            jasmine.waitsFor(JasmineThread.run)
        },

        beginTests: function() {
            TestUtils.endTests()
            jasmine.describe("(test begin): set up", function() {
                jasmine.it("login as anonymous", function() {
                    JasmineThread.fn = function() {
                        Auth.login(function() {
                            jasmine.expect(Auth.getUserInfo().loggedAt.length).toEqual(1)
                            jasmine.expect(Auth.getUserId()).toEqual(Auth.getUserInfo().id)
                            JasmineThread.stop()
                        })
                    }
                    jasmine.waitsFor(JasmineThread.run)
                })
            })
        },

        endTests: function() {
            jasmine.describe("(test end): clean data", function() {
                jasmine.it("we remove all tasks", function() {
                    TestUtils.cleanTasks(jasmine)
                })

                jasmine.it("we clean the local storage", function() {
                    Utils.clearLocalStorage()
                    jasmine.expect(Utils.getLocalStorageSize()).toEqual(0)
                    jasmine.expect(Tasks.length).toEqual(0)
                })
            })
        }
    }

    return TestUtils
})
