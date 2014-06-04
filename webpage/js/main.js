require.config({
	paths: {
		jquery: 'libs/jquery/jquery',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text',
		templates: '../templates',
		bootstrap: 'libs/bootstrap/bootstrap',
		soundcloud: '//connect.soundcloud.com/sdk'
	},
	shim: {
		'soundcloud': {
			exports: 'SC'
		},
		'bootstrap': ['jquery'],
	}

});
require(['App'], function (App) {
	App.initialize();
});