define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, Tasks, Auth) {
    var task

    with(jasmine) {
        describe("New Tasks", function() {

            it("saves as you type", function() {
                // create new task
                var el = $('.first-input .task-input')
                el.focus()
                Utils.keyboard.simulateTyping('second task')
                Utils.keyboard.simulateKey('Enter')

                // focus on edit
                el = $('.all-tasks .task-container .task-input').first()
                el.focus()

                task = Tasks.at(0)

                var title = 'up'
                Utils.keyboard.simulateTyping(title)

                // saves locally as you type
                expect(task.get('title')).toEqual(title)

                // saves remotely as you type
                task.bind('remote_update', function() {
                    expect(_.include(['second task', 'u', 'up'], this.get('title'))).toBeTruthy()
                    task.unbind('remote_update')
                }, task)
            })

            it("can toggle done", function() {
                el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeTruthy()

                el = $('.all-tasks .task-container .task-status').first()
                el.trigger('click')
                expect(task.get('done')).toBeFalsy()
            })

            it("model is tied to the view", function() {
                Tasks.at(0).save({
                    title: 'u2'
                })
                el = $('.all-tasks .task-container .task-input').first()

                Tasks.at(0).save({
                    title: 'u3'
                }, {
                    silent: true
                })
                expect(el.val()).toEqual('u2')
            })

            it("doesn't save empty when using backspace", function() {

            })

            it("editing in window A, displays it in window B", function() {
                // create iframe
                // Note: works on chrome and I don't have to write code to handle recursivity. Could be an issue elsewhere
                //                var href = window.location.href
                //                $('<iframe src="' + href + '" id="clone" width="1200" height="800"/>').appendTo('body');
            })

            it("creating in window A, creates it in window B", function() {})
        })
    }
})
