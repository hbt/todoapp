define(['deps/jasmine/jasmine-html', 'utils/utils', 'collections/tasks', 'modules/authentication'], function(jasmine, Utils, Tasks, Auth) {
    var task

    with(jasmine) {
        describe("multi devices", function() {

            it("has more than one device active", function() {
                // create iframe
                // Note: works on chrome and I don't have to write code to handle recursivity. Could be an issue elsewhere
                //                var href = window.location.href
                //                $('<iframe src="' + href + '" id="clone" width="1200" height="800"/>').appendTo('body');
            })

            it("has two clients in the same room", function() {})

            it("creating a record in one window, adds it to the other", function() {})

            it("updating a record in one window, updates it in the other", function() {})

            it("deleting a record in one window, deletes it in the other", function() {})
        })
    }
})
