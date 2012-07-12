// http://backbonetutorials.com/organizing-backbone-using-modules/
// https://github.com/thomasdavis/backboneboilerplate/tree/gh-pages/js/libs/backbone

function getVersion(prefix)
{
    var ret = ""
    if(document) {
        ret = prefix + (new Date().getTime())
    }
    return ret
}

require.config({
    paths: {
        jquery: 'deps/jq',
        underscore: 'deps/underscore',
        store: 'deps/backbone.localStorage',
        backbone: 'deps/backbone',
        text: 'deps/require/text'
    }
});

if(document)
{
    // TODO: abstract this with Utils.getVersion
    requireConfiguration['urlArgs'] =  getVersion("bust=v")
    require.config(requireConfiguration)
}


require(['jquery', 'backbone', 'underscore', 'store', 'utils/utils', 'views/task/list'], function($, Backbone, _, Store, Utils, TaskListView){
    $(function(){
        new TaskListView()
    })
});