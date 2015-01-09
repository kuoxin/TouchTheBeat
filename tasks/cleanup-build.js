'use strict';

module.exports = function (grunt) {

	grunt.registerTask('cleanup-build', function () {
		var paths = grunt.file.expand({
			cwd: 'dist/web'
		}, [
			'templates',
			'build.txt',

			'js/**',
			'!js',
			'!js/main.js',

			'vendor/*',
			'vendor/requirejs/**',
			'vendor/requirejs/.bower.json',
			'!vendor/requirejs',
			'!vendor/requirejs/require.js'

		]);
		for (var i = 0; i < paths.length; i++) {
			var path = 'dist/web/' + paths[i];
			if (grunt.file.exists(path)) {
				grunt.log.writeln('deleting "' + path + '"');
				grunt.file.delete(path);
			}
		}
	});

};
