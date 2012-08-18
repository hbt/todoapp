// file is used by both backend and frontend

function guid() {
    // Generate a pseudo-GUID by concatenating random hexadecimal.


    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

// hack to handle asynchronous calls in Jasmine
var JasmineThread = {
    _start: false,
    _stop: false,
    count: 0,

    start: function() {
        JasmineThread._start = true;
        JasmineThread._stop = false
        JasmineThread.count++
    },

    stop: function() {
        JasmineThread._stop = true;
        JasmineThread.count--
        if(JasmineThread.count < 0) {
            throw "Error in the Jasmine Runners -- calling stop more than run"
        }
    },

    fn: null,
    fnuntil: null,

    intervalId: null,
    until: function(fn, delay) {
        // should be higher than jasmine.DEFAULT_UPDATE_INTERVAL
        delay = delay || 275
        
        JasmineThread.intervalId = window.setInterval(fn, delay)
    },

    run: function() {
        if (!JasmineThread._start) {
            JasmineThread.start()
            if (JasmineThread.fn) JasmineThread.fn.call('')
            if (JasmineThread.fnuntil) JasmineThread.until(JasmineThread.fnuntil)
        }

        var res = JasmineThread._stop 
        if (JasmineThread._stop) {
            JasmineThread.reset()
        }

        return res
    },

    reset: function() {
        JasmineThread._start = false
        JasmineThread._stop = false

        JasmineThread.fn = null
        JasmineThread.fnuntil = null
        if (JasmineThread.intervalId) window.clearInterval(JasmineThread.intervalId)
    }
}

function initUtils() {
    c = console
    c.l = console.log
    c.d = console.dir
    uniqueID = guid
}

if (typeof exports === "undefined") {
    initUtils()
/**
    c.l = function() {
        console.log.apply(console, arguments)
        _.each(arguments, function(v) {
            var el = document.createElement("div")
            el.innerHTML = v
            document.body.appendChild(el)
        })
    }
    */
} else {
    exports = initUtils()
}
