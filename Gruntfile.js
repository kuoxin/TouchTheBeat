/* global module */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js",
                    appDir: "src",
                    modules: [{
                        name: "main"
                    }],
                    preserveLicenseComments: false,
                    removeCombined: true,
                    mainConfigFile: 'src/js/main.js',
                    inlineText: true,
                    dir: "dist",
                    paths: {},
                    fileExclusionRegExp: /(^\.git$|^\.idea$|^\.gitignore$|^LICENSE$|^README\.md$|boilerplate\.js)/,
                    done: function (done, output) {

                        var duplicates = require('rjs-build-analysis').duplicates(output);
                        if (duplicates.length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            grunt.log.warn(duplicates);
                            return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        }

                        grunt.log.writeln(output);
                        done();
                    }
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/{,*/}*.js',
                '!src/js/lib/**'
            ]
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src',
                    linkNatives: true,
                    outdir: 'docs/',
                    "themedir": "node_modules/yuidoc-theme-blue"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('default', 'jshint');


    grunt.registerTask('checkConfig', function () {
        if (!grunt.file.exists('src/js/config.js')) {
            grunt.fail.fatal("config.js in src/js/config.js does not exist. Please create it manually. You can refer to src/js/config.sample.js.");
        }
    });

    grunt.registerTask('cleanup-build', function () {
        var paths = grunt.file.expand({
            cwd: 'dist'
        }, [
            'templates',
            'build.txt',
            'js/**',
            '!js',
            '!js/main.js',
            '!js/lib',
            '!js/lib/require.js'
        ]);
        for (var i = 0; i < paths.length; i++) {
            var path = 'dist/' + paths[i];
            if (grunt.file.exists(path)) {
                grunt.log.writeln('deleting "' + path + '"');
                grunt.file.delete(path);
            }

        }
    });

    grunt.registerTask('build', ['checkConfig', 'requirejs', 'cleanup-build']);

    grunt.registerTask('create-ci-config', function () {
        if (!grunt.file.exists('src/js/config.js'))
            grunt.file.copy('src/js/config.sample.js', 'src/js/config.js');
    });

    grunt.registerTask('travis-ci', ['create-ci-config', 'jshint', 'check-deploy']);


    /*
     partly taken from https://github.com/Bartvds/demo-travis-gh-pages, Copyright (c) 2013 Bart van der Schoor MIT License
     */
    // get a formatted commit message to review changes from the commit log
    // github will turn some of these into clickable links
    function getDeployMessage() {
        var ret = '\n\n';
        if (process.env.TRAVIS !== 'true') {
            ret += 'missing env vars for travis-ci';
            return ret;
        }
        ret += 'branch:       ' + process.env.TRAVIS_BRANCH + '\n';
        ret += 'SHA:          ' + process.env.TRAVIS_COMMIT + '\n';
        ret += 'range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
        ret += 'build id:     ' + process.env.TRAVIS_BUILD_ID + '\n';
        ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
        return ret;
    }

    grunt.registerTask('check-deploy', function () {
        // only deploy under these conditions
        if (process.env.TRAVIS === 'true' && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false') {
            grunt.log.writeln('would execute deployment now');
            grunt.log.writeln(getDeployMessage());
            // deploy
        }
        else {
            grunt.log(process.env);
            grunt.log.writeln('skipped deployment');
        }
    });
};