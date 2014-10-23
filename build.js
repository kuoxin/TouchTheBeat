({
    baseUrl: "js",
    appDir: "./",
    modules: [
        {
            name: "main",
            exclude: ['infrastructure']
        }
    ],

    preserveLicenseComments: false,
    removeCombined: true,
    mainConfigFile: 'js/main.js',
    inlineText: true,
    dir: "../ttb-build",

    paths: {
        'google-analytics': 'empty:',
        'bootstrap': 'empty:',
        'jquery': 'empty:',
        'underscore': 'empty:',
        'backbone': 'empty:',
        'snap': 'empty:',
        'md5': 'empty:'
    },

    fileExclusionRegExp: /(^\.git$|^\.idea$|^\.gitignore$|^LICENSE$|^README\.md$|boilerplate\.js)/

})