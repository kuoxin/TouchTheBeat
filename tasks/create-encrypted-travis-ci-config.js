'use strict';
var CryptoJS = require('crypto-js');
module.exports = function (grunt) {

	grunt.registerTask('create-encrypted-travis-ci-config', function (key) {
		var PATHS = grunt.config('PATHS');

		if (typeof key === 'undefined') {
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

};
