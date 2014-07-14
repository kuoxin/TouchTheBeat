({
    baseUrl: "js",
    appDir: "./",
    modules: [
        {
            name: "main"
        }
    ],

    preserveLicenseComments: false,
    removeCombined: true,
    mainConfigFile: 'js/main.js',
    inlineText: true,
    dir: "../ttb-build",
    fileExclusionRegExp: /(^\.git$|^\.idea$|^\.gitignore$|^LICENSE$|^README\.md$|boilerplate\.js)/

})