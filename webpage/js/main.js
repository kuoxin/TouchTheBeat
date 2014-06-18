require.config({
	paths: {
		jquery: 'libs/jquery/jquery',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text',
		templates: '../templates',
		bootstrap: 'libs/bootstrap/bootstrap',
		soundcloud: '//connect.soundcloud.com/sdk',
		soundmanager2: 'libs/soundmanager2/soundmanager2',
		snap: 'libs/snap/snap.svg'
	},
	shim: {
		'soundcloud': {
			exports: 'SC'
		},
		'bootstrap': ['jquery'],
		'soundmanager2': {
			exports: 'soundManager'
		},
		'snap': {
			exports: 'Snap'
		}
	}

});
require(['App'], function (App) {
	App.initialize();
});