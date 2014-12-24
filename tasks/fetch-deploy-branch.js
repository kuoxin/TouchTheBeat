'use strict';

var shell = require('shelljs');

module.exports = function (grunt) {

	grunt.registerTask('fetch-deploy-branch', function () {
		var PATHS = grunt.config('PATHS'),
			REPOSITORY_URL = grunt.config('REPOSITORY_URL');

		shell.mkdir(PATHS.DEPLOY_GHPAGES_GIT);
		shell.cd(PATHS.DEPLOY_GHPAGES_GIT);
		grunt.log.writeln('Changed working directory to ' + PATHS.DEPLOY_GHPAGES_GIT);
		shell.exec('git clone -b "gh-pages" --quiet --single-branch --depth 1 ' + REPOSITORY_URL + ' .');
		grunt.log.writeln('git: cloned gh-pages branch');
		shell.exec('mkdir -p ' + PATHS.DEPLOY_RELATIVE);
		shell.cd('../');

	});

};