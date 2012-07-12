window.TaskTree = window.TaskTree || {}
TaskTree.getVersion = function getVersion(prefix)
{
    var ret = ""
    if (document)
    {
        ret = prefix + (new Date().getTime())
    }
    return ret
}

require.config(
{
    paths: {
        jquery: 'deps/jq',
        underscore: 'deps/underscore',
        store: 'deps/backbone.localStorage',
        backbone: 'deps/backbone',
        text: 'deps/require/text',
        templates: '../templates',
        handlebars: 'deps/handlebars'
    }
});

// r.js hack for minification
if (document)
{
    // TODO: abstract this with Utils.getVersion
    requireConfiguration['urlArgs'] = TaskTree.getVersion("bust=v")
    require.config(requireConfiguration)
}

require(['jquery', 'backbone', 'underscore', 'store', 'handlebars', 'utils/utils', 'views/task/list'], function($, Backbone, _, Store, HB, Utils, TaskListView)
{
    $(function()
    {
        new TaskListView()
    })
});
