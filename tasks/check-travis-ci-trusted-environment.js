'use strict';

module.exports = function (grunt) {

	grunt.registerTask('check-travis-trusted-environment', function () {
		// only deploy under these conditions
		if (!grunt.config('TRAVIS_TRUSTED')) {
			grunt.fail.warn("Travis environment was not trusted. Stopping deploy.");
		}
	});

};