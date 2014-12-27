/* global module, process, __dirname, require */
module.exports = function (grunt) {
    'use strict';

    var loadConfig = require('load-grunt-config');

    loadConfig(grunt, {
        configPath: __dirname + '/tasks/options',
        data: {
            TRAVIS: process.env.TRAVIS === 'true',
            TRAVIS_TRUSTED: process.env.TRAVIS === 'true' && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false',
            GIT_USER: {
                name: "Travis CI Continuous Deployment Script",
                email: "touchthebeatdev@gmail.com"
            },
            PATHS: {
				CONFIG_TRAVIS_CI_ENCRYPTED: 'app/js/config.travis-ci.encrypted',
				CONFIG_TRAVIS_CI: 'app/js/config.travis-ci.js',
				CONFIG: 'app/js/config.js',
                DEPLOY_GHPAGES_GIT: 'temp-ghpages',
                DEPLOY_RELATIVE: 'edge/' + process.env.TRAVIS_BRANCH,
                DEPLOY_COPY_TARGET: 'temp-ghpages/edge/' + process.env.TRAVIS_BRANCH
            },
            REPOSITORY_URL: '"https://' + process.env.GitHubAuthenticationKey + '@github.com/TouchTheBeat/TouchTheBeat.git"',
            VARNAME_ENCRYPTIONKEY: 'configEncryptionKey'
        }
    });

    grunt.loadTasks('tasks');

	grunt.registerTask('update', [
		'bower-install-simple:bower-update',
		'bower:bower-update-requirejs-paths'
	]);

	grunt.registerTask('lint',
		'jshint:src'
	);
	grunt.registerTask('build', [
		'clean:dist',
		'check-config',
		'requirejs',
		'cleanup-build',
		'uglify'
	]);
	grunt.registerTask('buildDocs', [
		'yuidoc'
	]);
	grunt.registerTask('travis-ci-build', [
		'check-travis-trusted-environment',
		'decrypt-travis-ci-config',
		'lint',
		'build'
	]);
	grunt.registerTask('travis-ci-deploy', [
		'check-travis-trusted-environment',
		'fetch-deploy-branch',
		'clean:deploy',
		'copy:deploy',
		'push-build'
	]);

};
