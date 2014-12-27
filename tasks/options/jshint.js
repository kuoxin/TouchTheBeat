module.exports = {
	src: {
		src: [
			'Gruntfile.js',
			'app/js/{,*/}*.js',
			'!app/vendor/**'
		],
		options: {jshintrc: '.jshintrc'}
	}
};
