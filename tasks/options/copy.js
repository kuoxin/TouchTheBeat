module.exports = function (grunt) {
	return {
		deploy: {
			expand: true,
			cwd: 'dist/',
			src: '**',
			dest: '<%= PATHS.DEPLOY_COPY_TARGET %>'
		}
	};
};
