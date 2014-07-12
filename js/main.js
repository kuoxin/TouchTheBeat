require.config({
	paths: {
		jquery: 'libs/jquery/jquery',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		text: 'libs/require/text',
		templates: '../templates',
		bootstrap: 'libs/bootstrap/bootstrap',
		snap: 'libs/snap/snap.svg',
        'google-analytics' :         [
            'http://www.google-analytics.com/analytics',
            'libs/google-analytics/google-analytics'
        ],
        tv4 : 'libs/tv4/tv4',
        schema : 'schema'
	},
	shim: {
		'bootstrap': ['jquery'],
		'snap': {
			exports: 'Snap'
		},
        'google-analytics':  {
            exports: 'ga'
        }
	}

});
require(['app'], function (App) {
    "use strict";
	App.initialize();
});