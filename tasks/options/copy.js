var PATHS = {
	CONFIG_TRAVIS_CI_ENCRYPTED: 'src/js/config.travis-ci.encrypted',
	CONFIG_TRAVIS_CI: 'src/js/config.travis-ci.js',
	CONFIG_SAMPLE: 'src/js/config.sample.js',
	CONFIG: 'src/js/config.js',
	DEPLOY_GHPAGES_GIT: 'temp-ghpages'
};

PATHS.DEPLOY_RELATIVE = 'edge/' + process.env.TRAVIS_BRANCH;
PATHS.DEPLOY_COPY_TARGET = PATHS.DEPLOY_GHPAGES_GIT + '/' + PATHS.DEPLOY_RELATIVE;

module.exports = {
	deploy: {
		expand: true,
		cwd: 'dist/',
		src: '**',
		dest: PATHS.DEPLOY_COPY_TARGET
	}
};