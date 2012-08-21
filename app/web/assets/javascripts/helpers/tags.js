define(['underscore'], function(_) {
    var Helper = {
        extractTags: function(string)  {
            var res =  _.chain(string.split(" ")).filter(function(token) {
                return token.startsWith('#')
            }).map(function(token) {
                return token.substr(1).toLowerCase()
            }).value()

            return res || []
        }
    }

    return Helper
})
