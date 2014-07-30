define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'util/analytics',
    'bootstrap'
], function ($, _, Backbone, Router, analytics) {
    var app = {
        router: null,

        applicationwithmenuisrendered: false,
        currentview: null,

        startlevel: function (level) {
            app.setFullScreenContent(app.router.playlevelview, level);
        },

        setFullScreenContent: function () {
            console.log(arguments);
            app.router.applicationwithmenuisrendered = false;

            app.currentview = [].shift.call(arguments);
            app.currentview.setElement('#body').render.apply(app.currentview, arguments);
            analytics.trackPageView(app.router.current());

        },

        setContent: function () {

            if (!app.router.applicationwithmenuisrendered) {
                app.router.applicationwithmenuview.render();
                app.router.applicationwithmenuisrendered = true;
            }

            if (app.currentview != null) {
                if (app.currentview.onClose)
                    app.currentview.onClose();

                app.currentview.dispose();
            }

            app.currentview = [].shift.call(arguments);
            app.currentview.setElement($('#content')).render.apply(app.currentview, arguments);

            analytics.trackPageView(app.router.current());

        }

    };
    return app;
});