define(['jquery', 'utils/utils'], function($, Utils) {
    var TestUtils = {
        createNewTask: function(title) {
            var el = $('.first-input .task-input')
            el.focus()
            Utils.keyboard.simulateTyping(title)
            Utils.keyboard.simulateKey('Enter')
        }
    }

    return TestUtils
})
