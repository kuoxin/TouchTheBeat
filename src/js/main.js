require.config({
    paths: {
        Framework: 'framework/Framework',
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        templates: '../templates',
        snap: 'lib/snap.svg',
        'google-analytics': 'lib/analytics',
        tv4: 'lib/tv4',
        schema: 'schema',
        md5: 'lib/md5'
    },
    shim: {
        'lib/bootstrap': {
            deps: ['jquery'],
            exports: "$.fn.popover"
        },
        'lib/sweet-alert': {
            exports: "window.swal"
        },
        'jquery' : {
            exports: '$'
        },
        'snap': {
            exports: 'Snap'
        },
        'google-analytics': {
            exports: 'ga'
        },
        'sc': {
            exports: 'SC'
        },
        'md5': {
            exports: 'CryptoJS'
        },
        'lib/jasny-bootstrap': ['jquery']
    },
    enforceDefine: true
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