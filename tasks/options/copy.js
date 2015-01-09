module.exports = function (grunt) {
	return {
		deploy: {
			expand: true,
			cwd: 'dist/web/',
			src: '**',
			dest: '<%= PATHS.DEPLOY_COPY_TARGET %>'
		}
	};
};
