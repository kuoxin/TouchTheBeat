module.exports = {
	src: {
		src: [
			'Gruntfile.js',
			'src/js/{,*/}*.js',
			'!src/js/lib/**'
		],
		options: {jshintrc: '.jshintrc'}
	}
};