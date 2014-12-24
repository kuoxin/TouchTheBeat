'use strict';

module.exports = function (grunt) {

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

};