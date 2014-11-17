require.config({
    paths: {
        Framework: 'framework/Framework',
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        templates: '../templates',
        bootstrap: 'lib/bootstrap',
        snap: 'lib/snap.svg',
        'google-analytics': 'lib/analytics',
        tv4: 'lib/tv4',
        schema: 'schema',
        md5: 'lib/md5'
    },
    shim: {
        'bootstrap': ['jquery'],
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
    }

});


require([
    'jquery',
    'underscore',
    'Framework',
    'config',
    'app',
    'API',
    'models/Session',
    'router'
], function ($, _, Framework, config, app, API, Session, Router) {

    if (typeof config.host == 'undefined')
        throw ('Backend host not specified. Open config.js to do so.');

    if (config.debug) {
        window.app = app;
    }
    else {
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
    API.initialize(config.host);
    app.init({
        session: new Session(),
        router: new Router()
    });
    Framework.history.start();
    console.info('Initializing TouchTheBeat has completed.');
});