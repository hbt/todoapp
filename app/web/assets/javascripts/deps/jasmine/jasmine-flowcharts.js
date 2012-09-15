define(['jasmine', 'underscore'], function(jasmine, _) {
    // TODO(hbt): add JasmineThread  to this toolbox
    var JF = {
        magicKeys: ['_summary', '_file', '_title', '_desc', '_f'],
        // TODO(hbt): add support for prefix and postfix e.g ?
        magicPrefix: ['//'],

        /**
         * generate jasmine specs from JSON
         */
        createSpecs: function(json) {
            var self = this
            var mk = self.magicKeys

            jasmine.jasmine.jspecs = jasmine.jasmine.jspecs || []
            jasmine.jasmine.jspecs.push(json)

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
            if(json == null) {
                jasmine.it(title, function() {
                    jasmine.expect(true).toBeTruthy()
                })
                return;
            }

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
            /**
             * create graph from JSON by calling a remote method to generate the graph using dot
             */
            create: function(json, jdata) {
                var self = this
                // TODO(hbt): abstract this
                self.server = (AppConfig && AppConfig.server)

                var strGraph = self.createGraph(json, jdata.suite)

                var filename = (json['_summary']._file + json['_summary']._title).replace(' ', '_')

                $.ajax({
                    // TODO(hbt): abstract this
                    url: self.server + "/jasmine/graphiz",
                    type: 'post',
                    context: document.body,
                    data: {
                        'graphiz': strGraph,
                        'filename': filename
                    },
                    success: function(data) {
                        if(jdata) {
                            var img = document.createElement('img')
                            img.setAttribute('src', data)
                            jdata.el.appendChild(img)
                        }
                    }
                });

                return strGraph
            },

            createGraph: function(json, suite) {
                var ret = "digraph G {\n\
  bgcolor=black;\n\
  node [shape=box, color=lightblue2, style=filled fontsize=14];\n\
  splines=\"polyline\";\n\
  edge [arrowsize=1, color=gold];\n\
"
                var self = this

                var prev = null
                _.each(json, function(v, k) {
                    if (k.startsWith('//')) return;
                    if (k === '_summary') {
                        k = v._title
                    }

                    ret += "\n"
                    ret += self.createOneNode(k, v, prev)
                    prev = {
                        title: k,
                        suite: suite
                    }
                })

                ret += "\n}"

                return ret
            },

            findSpec: function(suite, k) {
                var ret = null
                var self = this

                for (var index in suite.specs_) {
                    var spec = suite.specs_[index]
                    if(spec.description === k)  {
                        ret = spec
                        break;
                    }
                }

                if(!ret) {
                    for(index in suite.suites_) {
                        var nsuite = suite.suites_[index]
                        spec = self.findSpec(nsuite, k)
                        if(spec) {
                            ret = spec
                            break;
                        }
                    }
                }


                return ret
            },

            createOneNode: function(k, v, prev) {
                var ret = "  "
                var self = this

                var colorMap = {
                    'skipped': 'azure4',
                    'failed': 'firebrick',
                    'passed': 'palegreen4'
                }

                var suite = prev && prev.suite
                var color = colorMap['skipped']

                if(suite) {
                    var spec = this.findSpec(suite, k)
                    if(spec) {
                        if(spec.results_.totalCount === 0) {
                            color = colorMap.skipped
                        } else if(spec.results_.failedCount > 0) {
                            color = colorMap.failed
                        } else if(spec.results_.passedCount > 0) {
                            color = colorMap.passed
                        }
                    }
                }

                // skip any magic keys
                if (_.include(JF.magicKeys, k)) {
                    return "";
                }

                // by default, exception are for "No" . Yes is the default path
                var isCondition = k.endsWith('?') || k.endsWith('?0') || k.endsWith('?1')
                var isCondFalse = isCondition || k.endsWith('?0')

                // print a box or a diamond if it is a condition
                if (isCondition) {
                    ret = this.genNodeHash(k) + ' [label="' + k + '" style="rounded,filled", shape="diamond"]'
                } else {
                    ret = this.genNodeHash(k) + ' [label="' + k + '" color="' + color + '"]'
                }

                // link the current node to the previous one or its parent
                if (prev && prev.title) {
                    ret += "\n"
                    ret += this.genNodeHash(prev.title) + ' -> ' + this.genNodeHash(k)
                    if (prev.desc) ret += ' [label="No" color="red" fontcolor="red"]';
                }

                // check if the node has children and loop recursively
                if (v && (typeof v === 'object' || typeof v._f === 'object')) {
                    var arr = v._f || v
                    var data = {
                        title: k
                    }
                    if (isCondition && isCondFalse) {
                        data.desc = 'No'
                    }
                    _.each(arr, function(cv, ck) {
                        if (ck.startsWith('//')) return;
                        ret += "\n" + self.createOneNode(ck, cv, data)
                        data = {
                            title: ck,
                            suite: suite
                        }

                    })
                }

                return ret
            },

            genNodeHash: function(str) {
                var ret = "node" + str.hashCode()
                ret = ret.replace(/[^\w\s]/gi, '')
                return ret
            }
        }
    }

    return JF
})
