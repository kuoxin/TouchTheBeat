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

        models: {
            levelEditorModel: null
        },

        baseviewIsRendered: false,


        startlevel: function (level) {
            app.setFullScreenContent(app.router.views.playlevelview, level);
        },

        setFullScreenContent: function () {
            app.baseviewIsRendered = false;

            app.router.views.current = [].shift.call(arguments);
            app.router.views.current.setElement('#body').render.apply(app.router.views.current, arguments);
            analytics.trackPageView(app.router.getCurrentAppStatus());
        },

        setContent: function () {

            var newview = [].shift.call(arguments);

            if (app.router.views.current == newview)
                return;

            if (!app.baseviewIsRendered) {
                app.router.views.baseview.render();
                app.baseviewIsRendered = true;
            }

            if (app.router.views.current != null) {
                if (app.router.views.current.onClose)
                    app.router.views.current.onClose();

                app.router.views.current.dispose();
            }

            app.router.views.current = newview;
            app.router.views.current.setElement($('#content')).render.apply(app.router.views.current, arguments);

            analytics.trackPageView(app.router.getCurrentAppStatus());

        }

    };
    return app;
});