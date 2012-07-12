// node r.js -o build.js
// disable urlArgs or use web version
(
{
    name: 'app',
    baseUrl: '../web/assets/javascripts',
    out: 'min.js',
    optimize: "none",
    findNestedDependencies: true,
    mainConfigFile: '../web/assets/javascripts/app.js'
})
