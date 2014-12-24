'use strict';

var shell = require('shelljs');

module.exports = function (grunt) {

	/**
	 * Get a formatted commit message to review changes from the commit log.
	 * GitHub will turn some of these into clickable links.
	 * customized from https://github.com/Bartvds/demo-travis-gh-pages, Copyright (c) 2013 Bart van der Schoor MIT License
	 */
	function getDeployMessage() {
		var ret = ' -m "auto-deploy via travis ci"';
		if (!grunt.config('TRAVIS')) {
			ret += ' -m "missing env vars for travis-ci"';
			return ret;
		}

		ret += ' -m "branch:       ' + process.env.TRAVIS_BRANCH + '"';
		ret += ' -m "SHA:          ' + process.env.TRAVIS_COMMIT + '"';
		ret += ' -m "range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '"';
		ret += ' -m "build id:     ' + process.env.TRAVIS_BUILD_ID + '"';
		ret += ' -m "build number: ' + process.env.TRAVIS_BUILD_NUMBER + '"';
		return ret;
	}

	grunt.registerTask('push-build', function () {
		var PATHS = grunt.config('PATHS'),
			REPOSITORY_URL = grunt.config('REPOSITORY_URL'),
			GIT_USER = grunt.config('GIT_USER');

		shell.cd(PATHS.DEPLOY_GHPAGES_GIT);
		grunt.log.writeln('Changed working directory to ' + PATHS.DEPLOY_GHPAGES_GIT);
		shell.exec('git config user.name "' + GIT_USER.name + '"');
		shell.exec('git config user.email "' + GIT_USER.email + '"');
		grunt.log.writeln('Set git user information');
		shell.exec('git add -A');
		var deploymessage = getDeployMessage();
		shell.exec('git commit ' + deploymessage);
		grunt.log.writeln('git: commited the build:' + deploymessage.replace(new RegExp("-m", 'g'), "\n"));

		shell.exec('git push ' + REPOSITORY_URL + ' "gh-pages" --quiet');
		grunt.log.writeln('git: pushed the build to repository');
		grunt.log.writeln('Deploying finished.');
		shell.cd('../');
	});


};