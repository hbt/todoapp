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
        socket: 'deps/socket.io',
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

require(['jquery', 'backbone', 'underscore', 'socket', 'store', 'handlebars', 'utils/utils'], function($, Backbone, _, WS, Store, HB, Utils)
{
    var socket = WS.connect('http://localhost:3000')
    socket.on('e', function(data)
    {
        socket.send('wasssaa')
    })
    $(document).ready(function()
    {
        require(['views/task/list'], function(TaskListView)
        {
            new TaskListView()
        })
    })
});
