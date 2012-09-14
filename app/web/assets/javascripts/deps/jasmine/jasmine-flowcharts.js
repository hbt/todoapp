define(['deps/jasmine/jasmine-html', 'underscore'], function(jasmine, _) {
    // TODO(hbt): add JasmineThread  to this toolbox
    var JF = {
        magicKeys: ['_summary', '_file', '_title', '_desc', '_f'],
        // TODO(hbt): add support for prefix and postfix e.g ?
        magicPrefix: ['//'],

        createSpecs: function(json) {
            var self = this
            var mk = self.magicKeys

            jasmine.describe('file: ' + json['_summary']._file, function() {
                jasmine.it(json['_summary']._desc, function() {
                    jasmine.expect(true).toBeTruthy()
                })

                _.each(json, function(v, k) {
                    if (_.include(mk, k)) {
                        return;
                    }

                    self.createOneSpec(k, v)
                })
            })

        },

        createOneSpec: function(title, json) {
            var self = this

            if (typeof json === 'function') {
                jasmine.it(title, json)
            } else if (typeof json._f === 'function') {
                jasmine.it(title, json._f)
            } else if (typeof json._f === 'object' || typeof json === 'object') {
                var obj = json._f || json
                jasmine.describe(title, function() {
                    _.each(obj, function(v, k) {
                        self.createOneSpec(k, v)
                    })
                })
            }
        },
        
        Graphiz: {
            server: '',
            create: function(json) {
                var self = this
                // TODO(hbt): abstract this
                self.server = self.server || (AppConfig && AppConfig.server)

               var strGraph =
                   "digraph G {\n\
bgcolor=black;\n\
node [shape=box, color=lightblue2, style=filled];\n\
edge [arrowsize=1, color=gold];\n\
login -> asd \n\
asd -> asdw \n\
}" ;

                var filename = (json['_summary']._file + json['_summary']._title).replace(' ', '_')

                $.ajax(
                {
                    // TODO(hbt): abstract this
                    url: self.server + "/jasmine/graphiz",
                    type: 'post',
                    context: document.body,
                    data: {
                        'graphiz': strGraph,
                        'filename': filename
                    },
                    success: function(data)
                    {
                        document.body.innerHTML += '<img src="' + data + '"/>'
                    }
                });

                return strGraph
            }
        }
    }

    return JF
})
