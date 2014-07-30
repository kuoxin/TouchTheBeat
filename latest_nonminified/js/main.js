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