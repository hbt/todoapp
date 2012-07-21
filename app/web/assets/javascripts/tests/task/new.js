define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, Tasks, Auth) {
    with(jasmine) {
        describe("New Tasks", function() {

            it("creates new task and saves locally and remotely", function() {
                var title = 'first task'

                // type something and press enter
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping(title)
                Utils.keyboard.simulateKey('Enter')

                // data is saved
                var timestamp = +new Date() + 5
                var task = Tasks.at(0)
                var oldtask = _.clone(task.toJSON())
                expect(task.get('title')).toEqual(title)
                expect(task.get('createdAt')).toBeLessThan(timestamp)
                expect(task.get('updatedAt')).toBeLessThan(timestamp)
                expect(task.get('id').length).toEqual(36)

                // data is synced remotely
                task.bind('remote_update', function() {
                    var diff = _.difference(_.values(task.toJSON()), _.values(oldtask))
                    // only difference is the new remote ID + userId
                    expect(diff.length).toEqual(2)
                    expect(task.get('_id').length).toEqual(24)
                    expect(task.get('userId')).toEqual(Auth.getUserId())
                }, task)


                // input is cleared
                expect(el.val().length).toEqual(0)
            })


            it("doesn't create a task if title is empty", function() {
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping('')
                Utils.keyboard.simulateKey('Enter')

                expect(Tasks.length).toEqual(1)

                el.focus()
                Utils.keyboard.simulateTyping('   ')
                Utils.keyboard.simulateKey('Enter')

                expect(Tasks.length).toEqual(1)

            })


            // input is cleared on blur
            it("clears the input when focus is removed", function() {
                // TODO(hbt): wait 5000 then clear the input and make sure input has no changed. if clicked, it cancels the timer
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping('something random')
                el.blur()


                expect(Tasks.length).toEqual(1)
                expect(el.val()).toEqual('')
            })
        })
    }
})
