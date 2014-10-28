var host = 'http://localhost/ttb-backend/';
//var host = 'https://cldr.pf-control.de/ttb-server/dev/';
if (typeof host == 'undefined')
    throw ('Backend host not specified. Open main.js to do so.');

var DEBUGMODE = true;

require.config({
    paths: {
        jquery: ['//code.jquery.com/jquery-2.1.1.min', 'lib/jquery'],
        underscore: ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min', 'lib/underscore'],
        backbone: [ '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min', 'lib/backbone'],
        text: 'lib/text',
        templates: '../templates',
        bootstrap: ['//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min', 'lib/bootstrap'],
        snap: ['//cdn.jsdelivr.net/snap.svg/0.3.0/snap.svg-min', 'lib/snap.svg'],
        'google-analytics': ['//www.google-analytics.com/analytics', 'lib/analytics'],
        tv4: 'lib/tv4',
        schema: 'schema',
        sc: '//w.soundcloud.com/player/api',
        md5: ['//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5', 'lib/md5']
    },
    shim: {
        'bootstrap': ['jquery'],
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
        }
    }

});
require([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'API',
    'models/Session',
    'router',
    'BackboneModifications'
], function ($, _, Backbone, app, API, Session, Router) {
    if (DEBUGMODE)
        window.app = app;
    API.initialize(host);
    app.initialize({
        session: new Session(),
        router: new Router()

    });
    Backbone.history.start();
    console.info('Starting TouchTheBeat has completed.');
});