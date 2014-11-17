define([
    'jquery',
    'underscore',
    'Framework',
    'util/analytics'
], function ($, _, Framework, analytics) {
    var app;
    var App = Framework.Controller.extend({
        router: null,

        baseviewIsRendered: false,

        startlevel: function (level) {
            this.setFullScreenContent(this.router.views.playlevelview, level);
        },

        setFullScreenContent: function () {
            this.baseviewIsRendered = false;

            this.router.views.current = [].shift.call(arguments);
            this.router.views.current.setElement('#body').render.apply(this.router.views.current, arguments);
            analytics.trackPageView(this.router.getCurrentAppStatus());
        },

        getMainView: function () {
            console.log(this.router.views.baseview);
            return this.router.views.baseview;
        },

        setContent: function () {

            var newview = [].shift.call(arguments);

            if (this.router.views.current == newview)
                return;

            if (!this.baseviewIsRendered) {
                this.router.views.baseview.render();
                this.baseviewIsRendered = true;
            }

            if (this.router.views.current !== null) {
                if (this.router.views.current.onClose)
                    this.router.views.current.onClose();

                //this.router.views.current.dispose();
            }

            this.router.views.current = newview;
            this.router.views.current.setElement($('#content')).render.apply(this.router.views.current, arguments);

            analytics.trackPageView(this.router.getCurrentAppStatus());
        },

        init: function (data) {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audiocontext = new window.AudioContext();
            }
            catch (e) {
                console.error('Web Audio API is not supported in this browser');
            }
            _.extend(app, data);
            if (this.session.has('hash'))
                this.session.updateSessionUser();
            this.router.init();
        }
    });
    app = new App();
    return app;
});