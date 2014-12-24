'use strict';
var CryptoJS = require('crypto-js');
module.exports = function (grunt) {

	grunt.registerTask('decrypt-travis-ci-config', function () {
		var PATHS = grunt.config('PATHS'),
			VARNAME_ENCRYPTIONKEY = grunt.config('VARNAME_ENCRYPTIONKEY');
		if (grunt.file.exists(PATHS.CONFIG))
			grunt.fail.warn("\"config.js\" does already exist. This task would overwrite it.");

		grunt.task.requires('check-travis-trusted-environment');

		if (typeof process.env[VARNAME_ENCRYPTIONKEY] === 'undefined')
			grunt.fail.warn("Travis environment variable \"" + VARNAME_ENCRYPTIONKEY + "\" missing. Stopping deploy.");

		var key = process.env[VARNAME_ENCRYPTIONKEY];
		var encrypted_config = grunt.file.read(PATHS.CONFIG_TRAVIS_CI_ENCRYPTED, {
			encoding: 'utf8'
		});
		var config = CryptoJS.AES.decrypt(encrypted_config, key).toString(CryptoJS.enc.Utf8);
		grunt.file.write(PATHS.CONFIG, config, {
			encoding: 'utf8'
		});

	});

};