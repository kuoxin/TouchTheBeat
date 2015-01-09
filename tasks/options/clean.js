module.exports = function (grunt) {
	return {
		deploy: {
			src: ['<%= PATHS.DEPLOY_COPY_TARGET %>']
		},
		'dist-web': {
			src: 'dist/web'
		}
	};
};

