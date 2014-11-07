define([
    'jquery',
    'underscore',
    'backbone',
    'util/analytics',
    'bootstrap'
], function ($, _, Backbone, analytics) {
    var app = {
        router: null,

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

        getMainView: function () {
            console.log(app.router.views.baseview);
            return app.router.views.baseview;
        },

        setContent: function () {

            var newview = [].shift.call(arguments);

            if (app.router.views.current == newview)
                return;

            if (!app.baseviewIsRendered) {
                app.router.views.baseview.render();
                app.baseviewIsRendered = true;
            }

            if (app.router.views.current !== null) {
                if (app.router.views.current.onClose)
                    app.router.views.current.onClose();

                //app.router.views.current.dispose();
            }

            app.router.views.current = newview;
            app.router.views.current.setElement($('#content')).render.apply(app.router.views.current, arguments);

            analytics.trackPageView(app.router.getCurrentAppStatus());
        },

        initialize: function (data) {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                app.audiocontext = new window.AudioContext();
            }
            catch (e) {
                console.error('Web Audio API is not supported in this browser');
            }
            app = _.extend(app, data);
            if (app.session.has('hash'))
                app.session.updateSessionUser();
            app.router.init();
        }
    };
    return app;
});