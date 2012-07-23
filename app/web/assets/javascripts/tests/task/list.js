define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication', 'views/task/list'], function(jasmine, Utils, Tasks, Auth, TaskListView) {
    with(jasmine) {
        describe("List tasks", function() {

            it("hitting fetch doesn't duplicate the views", function() {
                //                TODO (hbt) add mixin for fetch to retrieve tasks without deleted (option to retrieve all of them) + clean up list view + deletedAt code
                Tasks.fetch()
                Tasks.fetch()
                expect($('.all-tasks').children().length).toEqual(Tasks.withoutDeleted().length)
            })

            it("should display data from local storage on fetch", function() {
                $('.all-tasks').children().remove()
                Tasks.fetch()

                expect(Tasks.at(0).get('title')).toEqual($('.all-tasks .task-container .task-input').first().val())
                expect(Tasks.withoutDeleted().length).toEqual($('.all-tasks').children().length)
            })

            it("should fetch and display data from remote if local storage is empty", function() {
                //                _.each(_.keys(Tasks._byId), function(v) {
                //                    Tasks.get(v).destroy()
                //                })

                // Note: this doesn't work. it messes up with the index when using each and destroy
                //                Tasks.each(function(v) {
                //                    c.l(v.get('title'))
                //                v.destroy()
                //                })
                //                expect(Tasks.length).toEqual(0)
                //
                //                Tasks.fetch()
            })

            it("fetching stores the last time a model was fetched", function() {})

            it("doing a fetch again, fetches nothing when everything is up-to-date", function() {})

            it("record is not updated if fetch results are older", function() {})

        })
    }
})
