// file is used by both backend and frontend

function initUtils() {
    c = console
    c.l = console.log
    c.d = console.dir
}

// hack to handle asynchronous calls in Jasmine
var JasmineThread = {
    _start: 0,
    _stop: 0,

    start: function() {
        JasmineThread._start = 1;
        JasmineThread._stop = 0
    },
    stop: function() {
        JasmineThread._stop = 1;
    },
    fn: function() {},

    run: function() {
        if (!JasmineThread._start) {
            JasmineThread.start()
            JasmineThread.fn.call('')
        }

        var res = JasmineThread._stop
        if (JasmineThread._stop) {
            JasmineThread.reset()
        }

        return res
    },

    reset: function() {
        JasmineThread._start = 0
        JasmineThread._stop = 0
    }
}

if (typeof exports === "undefined") {
    initUtils()
} else {
    exports = initUtils()
}
