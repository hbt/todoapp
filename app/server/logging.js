var fs = require('fs')
var path = require('path');

exports.init = function() {
    // create directory to store logs
    var logDir = __dirname + '/../logs/'
    path.exists(logDir, function(exists) {
        if (!exists) {
            fs.mkdir(logDir, 0755, function(e) {
                if (e) throw e
            })
        }
    });

    // listen to event and log error
    process.on('uncaughtException', function(err) {
        var strErr = dumpError(err)
        console.log('Caught exception: ' + strErr);
        var log = fs.createWriteStream(logDir + 'log.txt', {
            'flags': 'a'
        });
        log.write("==========================================================\n")
        log.end("\n" + new Date().toString() + " -- Exception: " + strErr + "\n");
    });
}

/**
 * dump error object into string
 */

function dumpError(err) {
    var ret = ""
    if (typeof err === 'object') {
        if (err.message) {
            ret += ('Message: ' + err.message)
        }
        if (err.stack) {
            ret += ("\nStacktrace:\n")
            ret += (err.stack);
        }
    } else {
        ret += err
    }

    return ret
}
