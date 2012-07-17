// file is used by both backend and frontend

function initUtils() {
    c = console
    c.l = console.log
    c.d = console.dir
}

if(typeof exports === "undefined") {
    initUtils()
} else
{
    exports = initUtils()
}