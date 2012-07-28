define(['deps/jasmine/jasmine-html', 'utils/utils', 'tests/utils/testUtils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, TestUtils, Tasks, Auth) {
    with(jasmine) {
        describe("Task: list", function() {

            var data = ['first', 'second', 'third', 'fourth', 'fifth']
            var max = 3,
                deletedIndex = 1

                it("init data", function() {
                    JasmineThread.fn = function() {
                        Tasks.bind('remote_update', function(model) {
                            // that's the exit for this test when all the callbacks are done
                            if (model && model.get('title') == data[deletedIndex] && model.get('deletedAt')) {
                                Tasks.unbind('remote_update')
                                JasmineThread.stop()
                            }
                        })
                    }

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

                    waitsFor(JasmineThread.run)
                })

                it("displays local tasks", function() {
                    //                Tasks.trigger('reset')
                    // tasks from local storage are there
                    expect(Tasks.length).toEqual(max)
                    expect($('.all-tasks').children().length).toEqual(max)
                })

                it("fetches remote tasks and displays them", function() {
                    // trigger fetch (local + remote)
                    max = data.length - 1

                    JasmineThread.fn = function() {
                        Tasks.fetch()
                        Tasks.bind('remote_update', function() {
                            if (Tasks.length === max) {
                                expect($('.all-tasks').children().length).toEqual(max)
                                Tasks.unbind('remote_update')
                                JasmineThread.stop()
                            }
                        })
                    }

                    waitsFor(JasmineThread.run)
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
                it("end of test", function() {
                    Tasks.destroyAll({
                        force: true
                    })
                })
        })
    }
})
