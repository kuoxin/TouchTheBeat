define([
    'jquery',
    'underscore',
    'Framework',
    'util/analytics'
], function ($, _, Framework, analytics) {
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
         * @method startLevel
         * @param {Level} level
         */
        startLevel: function (level) {
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
            var views = this.router.views;
            views.current.close();
            views.baseview.onClose();

            views.current = [].shift.call(arguments);
            views.current.setElement('body').render.apply(views.current, arguments);
            analytics.trackPageView(this.router.getCurrentAppStatus());
        },

        /**
         * @method getMainView
         * @returns {View}
         */
        getMainView: function () {
            return this.router.views.baseview;
        },


        /**
         * This method is used for navigation between contents in the app.
         * @method setContent
         * @param {View} view
         * @param [...]
         * all other params will be passed to the views render() function
         */
        setContent: function () {

            var newview = [].shift.call(arguments);
            var views = this.router.views;

            if (views.current == newview)
                return;

            if (views.current !== null) {
                views.current.close();
            }

            if (!this.baseviewIsRendered) {
                views.baseview.render();
                this.baseviewIsRendered = true;
            }

            views.current = newview;
            views.current.render.apply(views.current, arguments);
            views.baseview.setContent(views.current.el);

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

            // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
            app.id = (function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return function () {
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                };
            })()();


            Framework.API.setupBackend({
                host: config.backend.host,

                onAjaxPrepare: function prepareAjaxRequest(p) {
                    "use strict";
                    p.string = _.uniqueId('API-Request') + ' "' + p.type + ' ' + p.url;

                    if (typeof app.session !== 'undefined' && app.session !== null && app.session.has('hash')) {
                        p.string += ' with sessionID';
                        p.headers[config.backend.headerNames.session] = app.session.get('hash');
                    }

                    p.headers[config.backend.headerNames.timestamp] = Date.now() / 1000;
                    p.headers[config.backend.headerNames.token] = app.id;
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
            this.session.restore();
            this.router.init();
        }
    });
    app = new App();
    return app;
});