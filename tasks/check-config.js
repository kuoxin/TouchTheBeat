'use strict';

module.exports = function (grunt) {

	grunt.registerTask('check-config', 'Checking if the config file exists', function () {
		var PATHS = grunt.config('PATHS');
		if (!grunt.file.exists(PATHS.CONFIG)) {
			grunt.fail.warn("config.js in " + PATHS.CONFIG + " does not exist. Please create it manually. You can refer to 'src/js/config.sample.js'.");
		}
	});

};