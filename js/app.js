define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'utils/analytics',
  'bootstrap'
], function ($, _, Backbone, Router, analytics) {
    var app = {
        router: null,

        applicationwithmenuisrendered: false,
        currentview: null,

        startlevel: function (level) {

            analytics.trackAction('starting level', '');

            app.router.applicationwithmenuisrendered = false;


            app.currentview = app.router.playlevelview;
            app.router.playlevelview.render(level);
        },

        setContent: function () {

            if (!app.router.applicationwithmenuisrendered) {
                app.router.applicationwithmenuview.render();
                app.router.applicationwithmenuisrendered = true;
                console.info('rendered website with menu -  view');
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