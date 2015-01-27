/* global DocumentTouch */
define([
	'jquery',
	'underscore',
	'Framework',
	'util/analytics',
	'models/ErrorCodeModel'
], function ($, _, Framework, analytics, ErrorCodeModel) {
	var app;
	/**
	 * The main controller and container for the TouchTheBeat client.
	 * @class App
	 * @module src
	 * @constructor
	 * @extend Controller
	 */
	var App = Framework.Controller.extend({

		/**
		 * - stores the config and the router and session instance created in main.js
		 * - appends audiocontext as property when available
		 * - initializes an instance of the Backend class
		 * @method init
		 * @param {Object} config The content of the config module.
		 */
		init: function (config) {
			"use strict";

			/**
			 * @property config
			 */
			this.config = config;

			/**
			 * @property {Router} router
			 */
			this.router = this.config.router;

			/**
			 * @property {Session} session
			 */
			this.session = this.config.session;

			/**
			 * @property {ErrorCodeModel} errorCodes
			 */
			this.errorCodes = new ErrorCodeModel();

			/**
			 * @property {Backend} backend
			 */
			this.backend = new Framework.Backend(app);

			try {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				/**
				 * an instance of AudioContext that will be used by every instance of AudioController
				 * @property audiocontext
				 * @type {Window.AudioContext}
				 */
				this.audiocontext = new window.AudioContext();
			}
			catch (e) {
			}

			this.run();
		},

		/**
		 * @method getMainView
		 * @returns {MainView} mainView
		 */
		getMainView: function () {
			return this.mainView;
		},

		/**
		 * starts the game with the level passed as parameter
		 * @method startLevel
		 * @param {Level} level
		 */
		startLevel: function (level) {
			this.getMainView().setFullScreenContent(this.getMainView().views.playlevelview, level);
		},

		/**
		 * shows the view with the name passed as first parameter. all other parameters will be passed to the views render function
		 * @method showAppContent
		 * @param {String} viewName the name of the view
		 * @param [...]
		 */
		showAppContent: function () {
			"use strict";
			var contentName = [].shift.call(arguments);
			var content = this.getMainView().views[contentName] || this.getMainView().views[contentName + 'view'];
			this.getMainView().setContent(content, arguments);
		},

		/**
		 * checks the support of featues used by TouchTheBeat
		 * @method getCompabilityReport
		 * @returns {Object} compability
		 * schema: ``{AudioContext: boolean, SVG: boolean, Touch: boolean}``
		 */
		getCompabilityReport: function () {
			"use strict";
			var audiosupport = !!(window.AudioContext || window.webkitAudioContext);
			var svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
			var touch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
			return {
				AudioContext: audiosupport,
				SVG: svg,
				Touch: touch
			};
		},

		onBackendError: function (errorCode, request, response) {
			// backend error handling for general cases, only triggered if the error
			// was not handled by the model / view / collection / controller ...

			if (typeof this.showError[errorCode] !== 'undefined') {
				this.showError[errorCode].bind(this)(request, response);
			}
			else {
				//default error
				this.showError.unknownServerError.bind(this)(request, response);
			}
			//TODO check all error handling functions for completeness and then let them return something to prevent general error handling
		},

		showError: {
			unknownServerError: function () {
				"use strict";
				this.getMainView().notify({
					content: "An unknown backend error occured.",
					type: "error"
				});
			},

			clientIsUnauthorized: function () {
				"use strict";
				this.getMainView().alert({
					type: 'error',
					title: "Insecure Client",
					text: "Your version of TouchTheBeat was blocked due to security concerns. If you think that was a mistake, please contact me."
				});
			},
			clientIsOffline: function () {
				"use strict";
				this.getMainView().alert({
					type: 'error',
					title: "Connection to the TouchTheBeat-Backend failed",
					text: 'Please try again later or <a href="https://github.com/TouchTheBeat/TouchTheBeat/issues/new">open an issue</a>, if the error still occures.'
				});
			},
			'SIGNIN_NOT_SIGNEDIN': function () {
				this.getMainView().alert({
					type: 'error',
					title: "Sorry. Your session timed out.",
					text: 'Please take a second to log back in again.'
				});
			}
		},

		/**
		 * - setting up backend
		 * - trigger compability check
		 * - initializing session and router
		 * - start listening to backend errors
		 * @method run
		 * @param {Object} config
		 * The content of the config module.
		 */
		run: function () {
			this.listenTo(this.backend, 'all', this.onBackendError);
			this.backend.connect();
			console.log(this.getCompabilityReport());
			this.session.restore();
			this.router.init();
		}
	});
	app = new App();
	return app;
});
