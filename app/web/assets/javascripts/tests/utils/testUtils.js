define(['jquery', 'utils/utils', 'collections/tasks'], function($, Utils, Tasks) {
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
            var valid = (Tasks.length === 0 && $('.all-tasks .task-container').children().length === 0)

            JasmineThread.fn = function() {
                    if (valid) {
                        JasmineThread.stop()
                    }
                }

            if (!valid) jasmine.waitsFor(JasmineThread.run)
        }
    }

    return TestUtils
})
