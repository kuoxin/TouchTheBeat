require.config({
    paths: {
        Framework: 'framework/Framework',
        templates: '../templates',
		bootstrap: '../vendor/bootstrap/dist/js/bootstrap',
		'bootstrap-sweetalert': '../vendor/bootstrap-sweetalert/lib/sweet-alert',
		jquery: '../vendor/jquery/dist/jquery',
		md5: '../vendor/md5/index',
		underscore: '../vendor/underscore/underscore',
		'backbone.paginator': '../vendor/backbone.paginator/lib/backbone.paginator',
		ga: '../vendor/ga/index',
		'requirejs-text': '../vendor/requirejs-text/text',
		'snap.svg': '../vendor/snap.svg/dist/snap.svg-min',
		requirejs: '../vendor/requirejs/require',
		tv4: '../vendor/tv4/tv4',
		analytics: '../vendor/analytics/index',
		'backbone.select': '../vendor/backbone.select/dist/amd/backbone.select',
		backbone: '../vendor/backbone/backbone'
    },
	map: {
		'*': {
			text: 'requirejs-text',
			snap: 'snap.svg',
			'google-analytics': 'analytics',
			'lib/sweet-alert': 'bootstrap-sweetalert',
			'lib/bootstrap': 'bootstrap',
			'lib/tv4': 'tv4',
			'lib/backbone.select': 'backbone.select',
			'lib/backbone.paginator': 'backbone.paginator',
			Backbone: 'backbone'
		}
	},
    shim: {
		bootstrap: {
			deps: [
				'jquery'
			],
			exports: '$.fn.popover'
        },
		'bootstrap-sweetalert': {
			exports: 'window.swal'
        },
		jquery: {
            exports: '$'
        },
		'snap.svg': {
            exports: 'Snap'
        },
		analytics: {
            exports: 'ga'
        },
		sc: {
            exports: 'SC'
        },
		md5: {
            exports: 'CryptoJS'
		}
    },
	enforceDefine: true,
	packages: []
});


define([
    'jquery',
    'underscore',
    'Framework',
    'config',
    'app',
    'models/Session',
    'router',
    'views/MainView'
], function ($, _, Framework, config, app, Session, Router, MainView) {

    if (config.debug) {
        // make app a global object if debug == true
        window.app = app;
    }
    else {
        // disable console input/output on debug == false
        try {
            console.log = function () {
            };
            console.info = function () {
            };
        }
        catch (e) {
        }
    }

    console.info('Initializing TouchTheBeat.');

    app.init({
        session: new Session(),
        router: new Router(),
        backend: config.backend
    });

    app.mainView = new MainView();

    Framework.history.start();

    console.info('Initializing TouchTheBeat has completed.');
});
