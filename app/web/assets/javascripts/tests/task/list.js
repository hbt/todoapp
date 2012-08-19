define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {
    TestUtils.beginTests()

    with(jasmine) {
        describe("Task: list", function() {

            var data = ['first', 'second', 'third', 'fourth', 'fifth']
            var max = 3,
                deletedIndex = 1

                it("user has data in local and remote storage. not all data is stored locally", function() {
                    // create 3 tasks
                    _.each(data, function(v, k) {
                        if (k >= max) return;
                        Tasks.create({
                            title: v
                        })
                    })

                    expect(Tasks.length).toEqual(max)

                    // soft delete one
                    Tasks.at(deletedIndex).destroy()
                    max = max - 1
                    expect(Tasks.length).toEqual(max)

                    // create 2 remote tasks that don't yet exist in local storage
                    _.each(data, function(v, k) {
                        if (k <= max) return;
                        Tasks.create({
                            title: v,
                            id: guid()
                        }, {
                            skip_local: true,
                            silent: true,
                            skip_callback: true
                        })
                        Tasks.remove(Tasks.pop())
                    })

                    expect(Tasks.length).toEqual(max)

                    JasmineThread.fnuntil = function() {
                        if (Tasks.length === max) {
                            JasmineThread.stop()
                        }
                    }

                    waitsFor(JasmineThread.run)
                })

                it("user sees data stored locally and can edit it", function() {
                    // tasks from local storage are there
                    expect(Tasks.length).toEqual(max)
                    expect($('.all-tasks').children().length).toEqual(max)
                })

                describe("when app boots", function() {
                    it("we trigger a fetch and retrieve remote data and store it locally. user can now edit new data", function() {
                        // trigger fetch (local + remote)
                        max = data.length - 1

                        Tasks.fetch()
                        JasmineThread.fnuntil = function() {
                            if (Tasks.length === max) {
                                expect($('.all-tasks').children().length).toEqual(max)
                                JasmineThread.stop()
                            }
                        }

                        waitsFor(JasmineThread.run)
                    })
                })

                describe("watch out for fetch consuming too many resources", function() {
                    describe("fetch should retrieve most recent records. not all records", function() {
                        it("we store the last time a successful fetch was made", function() {})
                        it("if we fetch the data again, no data is returned because there is nothing new", function() {})
                    })
                })
        })
    }
})
