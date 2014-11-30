/* global module, process */
module.exports = function (grunt) {
    'use strict';
    var CryptoJS = require('crypto-js');
    var shell = require('shelljs');

    var TRAVIS = process.env.TRAVIS === 'true';
    var TRAVIS_TRUSTED = TRAVIS && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false';
    var PATHS = {
        CONFIG_TRAVIS_CI_ENCRYPTED : 'src/js/config.travis-ci.encrypted' ,
        CONFIG_TRAVIS_CI : 'src/js/config.travis-ci.js',
        CONFIG_SAMPLE : 'src/js/config.sample.js',
        CONFIG: 'src/js/config.js',
        DEPLOY_GHPAGES_GIT: 'temp-ghpages'
    };
    var GIT_USER = {
        name: "Travis CI Continuous Deployment Script",
        email: "touchthebeatdev@gmail.com"
    };

    PATHS.DEPLOY_RELATIVE = 'edge/' + process.env.TRAVIS_BRANCH;
    PATHS.DEPLOY_COPY_TARGET = PATHS.DEPLOY_GHPAGES_GIT + '/' + PATHS.DEPLOY_RELATIVE;

    var VARNAME_ENCRYPTIONKEY = 'configEncryptionKey',
        VARNAME_GITHUBAUTHKEY = 'GitHubAuthenticationKey';
    var REPOSITORY_URL = '"https://' + process.env[VARNAME_GITHUBAUTHKEY] + '@github.com/TouchTheBeat/TouchTheBeat.git"';



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
        },
        copy: {
            deploy: {
                expand: true,
                cwd: 'dist/',
                src: '**',
                dest: PATHS.DEPLOY_COPY_TARGET
            }
        },
        clean: {
            deploy: {
                src: [PATHS.DEPLOY_COPY_TARGET]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', 'jshint');


    grunt.registerTask('check-config', function () {
        if (!grunt.file.exists(PATHS.CONFIG)) {
            grunt.fail.warn("config.js in "+PATHS.CONFIG+" does not exist. Please create it manually. You can refer to "+PATHS.CONFIG_SAMPLE+".");
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

    grunt.registerTask('build', ['check-config', 'requirejs', 'cleanup-build']);

    grunt.registerTask('check-travis-trusted-environment', function () {
        // only deploy under these conditions
        if (!TRAVIS_TRUSTED) {
            grunt.fail.warn("Travis environment was not trusted. Stopping deploy.");
        }
    });

    grunt.registerTask('decrypt-travis-ci-config', function () {
        if (grunt.file.exists(PATHS.CONFIG))
            grunt.fail.warn("\"config.js\" does already exist. This task would overwrite it.");

        grunt.task.requires('check-travis-trusted-environment');

        if (typeof process.env[VARNAME_ENCRYPTIONKEY] === 'undefined')
            grunt.fail.warn("Travis environment variable \"" + VARNAME_ENCRYPTIONKEY + "\" missing. Stopping deploy.");

        var key = process.env[VARNAME_ENCRYPTIONKEY];
        var encrypted_config = grunt.file.read(PATHS.CONFIG_TRAVIS_CI_ENCRYPTED, {
            encoding: 'utf8'
        });
        var config = CryptoJS.AES.decrypt(encrypted_config, key).toString(CryptoJS.enc.Utf8);
        grunt.file.write(PATHS.CONFIG, config, {
            encoding: 'utf8'
        });

    });

    grunt.registerTask('create-encrypted-travis-ci-config', function(key){
        if (typeof key === 'undefined'){
            grunt.fail.warn("Supply a key to use for encryption as argument.");
        }
        var value = grunt.file.read(PATHS.CONFIG_TRAVIS_CI, {
            encoding: 'utf8'
        });
        var encrypted = CryptoJS.AES.encrypt(value, key);
        grunt.file.write(PATHS.CONFIG_TRAVIS_CI_ENCRYPTED, encrypted, {
            encoding: 'utf8'
        });
    });


    grunt.registerTask('travis-ci-build', ['check-travis-trusted-environment', 'decrypt-travis-ci-config', 'jshint', 'requirejs']);
    grunt.registerTask('travis-ci-deploy', ['check-travis-trusted-environment', 'cleanup-build', 'fetch-deploy-branch', 'clean:deploy', 'copy:deploy', 'push-build']);

    grunt.registerTask('fetch-deploy-branch', function () {
        shell.mkdir(PATHS.DEPLOY_GHPAGES_GIT);
        shell.cd(PATHS.DEPLOY_GHPAGES_GIT);
        grunt.log.writeln('Changed working directory to ' + PATHS.DEPLOY_GHPAGES_GIT);
        shell.exec('git clone -b "gh-pages" --quiet --single-branch --depth 1 ' + REPOSITORY_URL + ' .');
        grunt.log.writeln('git: cloned gh-pages branch');
        shell.exec('mkdir -p ' + PATHS.DEPLOY_RELATIVE);
        shell.cd('../');

    });

    grunt.registerTask('push-build', function () {
        shell.cd(PATHS.DEPLOY_GHPAGES_GIT);
        grunt.log.writeln('Changed working directory to ' + PATHS.DEPLOY_GHPAGES_GIT);
        shell.exec('git config user.name "' + GIT_USER.name + '"');
        shell.exec('git config user.email "' + GIT_USER.email + '"');
        shell.exec('git add -A');
        var deploymessage = getDeployMessage();
        shell.exec('git commit -m "' + deploymessage + '"');
        grunt.log.writeln('git: commited the build:' + deploymessage);

        shell.exec('git push ' + REPOSITORY_URL + ' "gh-pages" --quiet');
        grunt.log.writeln('git: pushed the build to repository');
        grunt.log.writeln('Deploying finished.');
        shell.cd('../');
    });

    /*
     partly taken from https://github.com/Bartvds/demo-travis-gh-pages, Copyright (c) 2013 Bart van der Schoor MIT License
     */
    // get a formatted commit message to review changes from the commit log
    // github will turn some of these into clickable links
    function getDeployMessage() {
        var ret = '\n\n';
        if (!TRAVIS) {
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
};