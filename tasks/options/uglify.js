module.exports = {
	dist: {
		files: {
			"dist/web/js/main.js": ["dist/web/js/main.js"]
		},
		options: {
			preserveComments: false,
			sourceMap: false,
			report: "min",
			beautify: {
				"ascii_only": true
			},
			banner: "/*! TouchTheBeat <%= package.version %> | " +
			"(c) 2014, <%= grunt.template.today('yyyy') %> Hermann Stolte | " +
			"https://github.com/TouchTheBeat/TouchTheBeat/blob/master/LICENSE */"//,
			/*compress: {
			 "hoist_funs": false,
			 loops: false,
			 unused: false
			 }*/
		}
	}
};
