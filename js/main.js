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
        sc: '//w.soundcloud.com/player/api'
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
        }
    }

});
require([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'app',
    'BackboneModifications'
], function ($, _, Backbone, Router, app) {


    app.router = Router.initialize();
    app.router.init();
    Backbone.history.start();
    console.info('loading of TouchTheBeat complete');
});