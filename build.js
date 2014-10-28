({
    baseUrl: "js",
    appDir: "./",
    modules: [
        {
            name: "main"//,
            //exclude: ['infrastructure']
        }
    ],

    preserveLicenseComments: false,
    removeCombined: true,
    mainConfigFile: 'js/main.js',
    inlineText: true,
    dir: "../ttb-build",

    paths: {
        //'google-analytics': 'empty:',
        //'bootstrap': 'lib/bootstrap.min',
        //'jquery': 'lib/jquery.min',
        //'underscore': 'lib/underscore.min',
        //'backbone': 'lib/backbone.min',

        //using the unminified version here for now because the minified version causes an uncaught SyntaxError
        //'snap': 'lib/snap.svg'
    },

    fileExclusionRegExp: /(^\.git$|^\.idea$|^\.gitignore$|^LICENSE$|^README\.md$|boilerplate\.js)/

})