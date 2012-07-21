define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks'], function(jasmine, Utils, Tasks) {
    with(jasmine) {
        describe("Tasks", function() {

            it("creates new task", function() {
                var title = 'first task'

                // type something and press enter
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping(title)
                Utils.keyboard.simulateKey('Enter')
                
                // data is saved
                var timestamp = +new Date()+5
                var task = Tasks.at(0)
                var oldtask = _.clone(task.toJSON())
                expect(task.get('title')).toEqual(title)
                expect(task.get('createdAt')).toBeLessThan(timestamp)
                expect(task.get('updatedAt')).toBeLessThan(timestamp)
                expect(task.get('id').length).toEqual(36)

                // data is synced remotely
                task.bind('remote_update', function() {
                    var diff = _.difference(_.values(task.toJSON()), _.values(oldtask))
                    // only difference is the new remote ID
                    expect(diff.length).toEqual(1)
                    expect(task.get('_id').length).toEqual(24)
                }, task)


                // input is cleared
                expect(el.val().length).toEqual(0)

                // type something and leave input

                // input is cleared on blur
                
                // nothing then press enter
                
                // no data is created
                
                // test title validation
                // add space to display error messages when stuff is invalid. One spot for the whole app


                // TODO(hbt): wait 5000 then clear the input and make sure input has no changed. if clicked, it cancels the timer
            })
        })
        }
})
