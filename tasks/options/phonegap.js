module.exports = function (grunt) {
	return {
		config: {
			root: 'dist/web',
			config: {
				template: 'phonegap/configTemplate.xml',
				data: {
					id: 'com.hstolte.touchthebeat',
					version: grunt.pkg.version,
					name: grunt.pkg.name
				}
			},
			cordova: 'phonegap/.cordova',
			html: 'index.html',
			path: 'dist/native',
			cleanBeforeBuild: true, // when false the build path doesn't get regenerated
			plugins: [],
			platforms: ['android'],
			/*releases: 'releases',
			 releaseName: function () {
			 return (grunt.pkg.name + '-' + grunt.pkg.version);
			 },*/
			debuggable: true,

			// Must be set for ios to work.
			// Should return the app name.
			name: function () {
				return grunt.pkg.name;
			}
		}
	};
};
