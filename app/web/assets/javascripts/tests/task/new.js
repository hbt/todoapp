define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, Tasks, Auth) {
    var task, oldtask, flag

    with(jasmine) {
        describe("New Tasks", function() {

            it("creates new task and saves locally", function() {
                var title = 'first task '

                // type something and press enter
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping(title)
                Utils.keyboard.simulateKey('Enter')

                // data is saved
                var timestamp = +new Date() + 5
                task = Tasks.at(0)
                oldtask = _.clone(task.toJSON())
                expect(task.get('title')).toEqual(title.trim())
                expect(task.get('createdAt')).toBeLessThan(timestamp)
                expect(task.get('updatedAt')).toBeLessThan(timestamp)
                expect(task.get('done')).toEqual(false)
                expect(task.get('id').length).toEqual(36)

                // input is cleared
                expect(el.val().length).toEqual(0)
            })

            it("saves remotely", function() {
                // data is synced remotely
                runs(function() {
                    flag = false
                    task.bind('remote_update', function() {
                        flag = true
                    }, task)
                })

                waitsFor(function() {
                    return flag
                }, 2000)

                runs(function() {
                    var diff = _.difference(_.values(task.toJSON()), _.values(oldtask))
                    // only difference is the new remote ID + userId
                    expect(diff.length).toEqual(2)
                    expect(task.get('_id').length).toEqual(24)
                    expect(task.get('userId')).toEqual(Auth.getUserId())
                    task.unbind('remote_update')
                })

            })


            it("appears at the top of the view", function() {
                expect($('.all-tasks .task-container .task-input').val()).toEqual(task.get('title'))
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
