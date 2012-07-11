var debug = 1

var c = console
c.l = console.log
c.d = console.dir

window.App = {}
App.Views = App.Views || {}
App.Collections = App.Collections || {}


if(debug) {
    var version = -1
    $(function(){
        setInterval(function() {
            $.ajax({
                url: '/version.txt',
                dataType: 'script',
                complete: function(data) {
                    if (data.status == 304) c.l('not working');

                    data = data.responseText
                    if(version == -1)
                        version = eval(data)

                    if(version < eval(data))
                        window.location.reload()
                }
            });
        }, 800)
    })
}

Utils = {
    getTemplate: function(obj) {
        _.each(Views, function(v) {
            c.l(obj)
            c.l(v === obj)
        })
    }
}