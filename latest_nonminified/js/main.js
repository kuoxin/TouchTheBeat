require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text',
        templates: '../templates',
        bootstrap: 'libs/bootstrap/bootstrap',
        snap: 'libs/snap/snap.svg',
        'google-analytics': '//www.google-analytics.com/analytics',
        tv4: 'libs/tv4/tv4',
        schema: 'schema'
    },
    shim: {
        'bootstrap': ['jquery'],
        'snap': {
            exports: 'Snap'
        },
        'google-analytics': {
            exports: 'ga'
        }
    }

});
require([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'app',
    'bootstrap'
], function ($, _, Backbone, Router, app) {

    Backbone.View.prototype.dispose = function () {
        //Will unbind all events this view has bound to
        //_.each(this.bindings, function (binding) {
        //     binding.model.unbind(binding.ev, binding.callback);
        // });
        // this.bindings = [];
        this.unbind();
        this.undelegateEvents();

        // this.unbind();        // This will unbind all listeners to events from
        // this view. This is probably not necessary
        // because this view will be garbage collected.
        //this.remove(); // Uses the default Backbone.View.remove() method which
        // removes this.el from the DOM and removes DOM events.
    };

    app.router = Router.initialize();
    app.router.init();
    Backbone.history.start();
    console.info('loading of TouchTheBeat complete');
});