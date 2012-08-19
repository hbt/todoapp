define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, Tasks, Auth) {
    var task

    with(jasmine) {
        describe("Offline mode", function() {

            it("switches to offline mode", function() {})

            it("checks if we are in offline mode", function() {})

            it("dirty list is empty", function() {})

            it("updating a task, marks the record as dirty", function() {})

            it("create a task, marks the record as dirty", function() {})

            it("deleting a task, marks the record as dirty", function() {})

            it("timer keeps checking for socket connection every X", function() {})

            it("can establish new socket connection", function() {})

            it("new socket is authenticated", function() {})

            it("syning dirty records empties the dirty list", function() {})
        })

        describe("remote fetch", function() {
            it("updates old local tasks", function() {})
            describe("last time fetch", function() {
                it("stores the last time a fetch was requested", function() {})
                it("only returns data where updatedAt > last time fetched", function() {})
                it("remote fetch returns all data if this is the first time", function() {})
            })
            it("when socket connect/reconnects, remote fetch is triggered", function() {})
        })
        it("doing a fetch again, fetches nothing when everything is up-to-date", function() {})
        it("hitting fetch multiple times doesn't duplicate the views", function() {})
    }
})
