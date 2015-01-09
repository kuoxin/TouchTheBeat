module.exports = function (grunt) {
	return {
		compile: {
			options: {
				baseUrl: "js",
				appDir: "app",
				modules: [{
					name: "main"
				}],
				preserveLicenseComments: false,
				removeCombined: true,
				mainConfigFile: 'app/js/main.js',
				inlineText: true,
				dir: "dist/web",
				fileExclusionRegExp: /(^\.git$|^\.idea$|^\.gitignore$|^LICENSE$|^README\.md$|boilerplate\.js)/,
				done: function (done, output) {
					var duplicates = require('rjs-build-analysis').duplicates(output);
					if (duplicates.length > 0) {
						grunt.log.subhead('Duplicates found in requirejs build:');
						grunt.log.warn(duplicates);
						return done(new Error('r.js built duplicate modules, please check the excludes option.'));
					}
					grunt.log.writeln(output);
					done();
				},
				optimize: "none"
			}
		}
	};

};
