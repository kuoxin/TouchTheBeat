module.exports = function (grunt) {
	return {
		web: [
			'clean:dist-web',
			'check-config',
			'requirejs',
			'cleanup-build',
			'uglify'
		],
		android: [
			'phonegap:build:android'
		]
	};
};
