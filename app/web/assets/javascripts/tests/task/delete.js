define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks'], function(jasmine, Utils, Tasks) {
    with(jasmine) {
        describe("deleting tasks", function() {

            it("deleting a record, marks it as deleted (deletedAt)", function() {
                var id = Tasks.at(0).get('id')
                var length = Tasks.length
                var time = +new Date()
                Tasks.at(0).destroy()

                expect(Tasks.length).toEqual(length)
                expect(Tasks.at(0).get('id')).toEqual(id)
                expect(Tasks.at(0).get('deletedAt')).toEqual(time)
            })

            it("deleting a record, doesn't remove it from local storage", function() {
                expect(Tasks.localStorage.find(Tasks.at(0)) !== null).toBeTruthy()
            })

            it("deleting a record, destroys the view associated to it", function() {
                expect($('.all-tasks').children().length).toEqual(1)
            })

            it("UI ignores deleted records on fetch", function() {
                Tasks.fetch()
                expect($('.all-tasks').children().length).toEqual(1)
            })
        })
    }
})
