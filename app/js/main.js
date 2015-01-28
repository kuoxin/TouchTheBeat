/* global requirejs,document */

var running = false;
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
		'requirejs-text': '../vendor/requirejs-text/text',
		'snap.svg': '../vendor/snap.svg/dist/snap.svg-min',
		requirejs: '../vendor/requirejs/require',
		tv4: '../vendor/tv4/tv4',
		analytics: '../vendor/analytics/index',
		'backbone.select': '../vendor/backbone.select/dist/amd/backbone.select',
		backbone: '../vendor/backbone/backbone',
		snackbarjs: '../vendor/snackbarjs/dist/snackbar.min'
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
		},
		snackbarjs: {
			deps: [
				'jquery'
			],
			exports: '$.snackbar'
		}
    },
	enforceDefine: true,
	packages: []
});

/**
 * requirejs error handling, will be triggered if the config file is missing
 * @param error
 */
requirejs.onError = function (error) {
	if (!running) {
		var output = '';
		if (error.requireModules[0] === 'config') {
			output += '<h1>The config.js file is missing.</h1><p>You need to create a config.js file in order to run TouchTheBeat.<a href="https://github.com/TouchTheBeat/TouchTheBeat#build">Click here for more information.</a></p>';
		}
		output += '<p>' + error.message + '</p>';

		var element = document.createElement("div");
		element.innerHTML = output;
		document.getElementsByTagName('body')[0].appendChild(element);
	}

};

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
	running = true;
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
