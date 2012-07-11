// http://backbonetutorials.com/organizing-backbone-using-modules/
// https://github.com/thomasdavis/backboneboilerplate/tree/gh-pages/js/libs/backbone
require.config({
    // TODO: abstract this with Utils.getVersion
    urlArgs: "bust=v" + new Date().getTime(),
    paths: {
        jquery: 'deps/jq',
        underscore: 'deps/underscore',
        store: 'deps/backbone.localStorage',
        backbone: 'deps/backbone',
        text: 'deps/require/text',
        order: 'deps/require/order'
    }
});


require(['jquery', 'backbone', 'underscore', 'store', 'utils/utils', 'views/task/list'], function($, Backbone, _, Store, Utils, TaskListView){
        $(function(){
            new TaskListView()
        })
});