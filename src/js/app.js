define([
    'jquery',
    'underscore',
    'Framework',
    'framework/API',
    'util/analytics'
], function ($, _, Framework, API, analytics) {
    var app;
    console.log(Framework);
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


            API.setupBackend({
                host: data.host,

                onAjaxPrepare: function prepareAjaxRequest(p) {
                    "use strict";
                    p.string = 'API-Request "' + p.type + ' ' + p.url;
                    if (typeof app.session !== 'undefined' && app.session !== null && app.session.has('hash')) {
                        p.string += ' with sessionID';
                        _.extend(p.headers || {},
                            {
                                'ttbSession': app.session.get('hash')
                            }
                        );

                    }
                    return p;
                }
            });


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
    console.log(app);
    return app;
});