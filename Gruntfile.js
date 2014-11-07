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
						done();
					}
				}
			}
		},
		jshint: {
			all: ['src/js/*.js'] //['src/js/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('checkConfig', function () {
		if (!grunt.file.exists('src/js/config.js')) {
			grunt.fail.fatal("config.js in src/js/config.js does not exist. Please create it manually. You can refer to src/js/config.sample.js.");
		}
	});

	grunt.registerTask('default', 'jshint');
	grunt.registerTask('build', ['checkConfig', 'requirejs']);
};