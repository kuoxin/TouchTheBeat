define([
    'jquery',
    'underscore',
    'Framework',
    'framework/API',
    'util/analytics'
], function ($, _, Framework, API, analytics) {
    var app;
    /**
     * The main controller and container for the TouchTheBeat client.
     * @class App
     * @constructor
     * @extend Controller
     */
    var App = Framework.Controller.extend({

        /**
         * @property {Router} router
         */
        router: null,

        /**
         * @property {boolean} baseviewIsRendered
         */
        baseviewIsRendered: false,

        /**
         * starts the game with the level passed as parameter
         * @method startlevel
         * @param {Level} level
         */
        startlevel: function (level) {
            this.setFullScreenContent(this.router.views.playlevelview, level);
        },

        /**
         * @method setFullScreenContent
         * @param {View} view
         * @param [...]
         * all other params will be passed to the views render() function
         */
        setFullScreenContent: function () {
            this.baseviewIsRendered = false;

            this.router.views.current = [].shift.call(arguments);
            this.router.views.current.setElement('#body').render.apply(this.router.views.current, arguments);
            analytics.trackPageView(this.router.getCurrentAppStatus());
        },

        /**
         * @method getMainView
         * @returns {View}
         */
        getMainView: function () {
            console.log(this.router.views.baseview);
            return this.router.views.baseview;
        },


        /**
         * This method is used for navigation between contents in the app.
         * @method setContent
         * @param {View} view
         *
         */
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

        /**
         * - configures backend
         * - checks compability
         * - starts session check
         * @method init
         * @param {Object} config
         */
        init: function (config) {


            API.setupBackend({
                host: config.backend.host,

                onAjaxPrepare: function prepareAjaxRequest(p) {
                    "use strict";
                    p.string = _.uniqueId('API-Request') + ' "' + p.type + ' ' + p.url;
                    p.headers = p.headers || {};

                    if (typeof app.session !== 'undefined' && app.session !== null && app.session.has('hash')) {
                        p.string += ' with sessionID';
                        p.headers[config.backend.headerNames.session] = app.session.get('hash');
                    }

                    p.headers[config.backend.headerNames.timestamp] = new Date().getTime();
                    p.headers[config.backend.headerNames.hash] = config.backend.createAccessHash(p);

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
            _.extend(app, config);
            if (this.session.has('hash'))
                this.session.updateSessionUser();
            this.router.init();
        }
    });
    app = new App();
    console.log(app);
    return app;
});