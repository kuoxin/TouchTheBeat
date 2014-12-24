module.exports = {
	compile: {
		name: '<%= package.name %>',
		description: '<%= package.description %>',
		version: '<%= package.version %>',
		url: '<%= package.homepage %>',
		options: {
			paths: 'src',
			linkNatives: true,
			outdir: 'docs/',
			"themedir": "node_modules/yuidoc-theme-blue"
		}
	}
};