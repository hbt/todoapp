define(['jquery', 'utils/utils', 'collections/tasks', 'utils/sync'], function($, Utils, Tasks, Sync) {
    var TestUtils = {
        createNewTask: function(title) {
            var el = $('.first-input .task-input')
            el.focus()
            Utils.keyboard.simulateTyping(title)
            Utils.keyboard.simulateKey('Enter')
        },

        cleanTasks: function(jasmine) {
            Tasks.destroyAll({
                force: true
            })

            JasmineThread.fnuntil = function() {
                var valid = (Tasks.length === 0 && $('.all-tasks .task-container').children().length === 0)
                if (valid && Sync.callbacksCount === 0) {
                    jasmine.expect(true).toBeTruthy()
                    JasmineThread.stop()
                }
            }

            jasmine.waitsFor(JasmineThread.run)
        }
    }

    return TestUtils
})
