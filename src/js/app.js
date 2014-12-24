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
		 * @property {Router} router
		 */
		router: null,

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
		 * @param {String} name of the view
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
		 * @returns {AudioContext: boolean, SVG: boolean, Touch: boolean}
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

		/**
		 * creates an ErrorCodeModel, configures the backend communication according to the config file and sets up request logging for development
		 * @method connectToBackend
		 */
		connectToBackend: function () {
			"use strict";

			// taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
			this.id = (function () {
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

			var errorCodeModel = new ErrorCodeModel();

			Framework.API.setupBackend({
				host: this.backend.host,

				onAjaxPrepare: function prepareAjaxRequest(p) {
					p.string = _.uniqueId('API-Request') + ' "' + p.type + ' ' + p.url;

					if (typeof app.session !== 'undefined' && app.session !== null && app.session.has('hash')) {
						p.string += ' with sessionID';
						p.headers[app.backend.headerNames.session] = app.session.get('hash');
					}

					p.headers[app.backend.headerNames.timestamp] = Date.now() / 1000;
					p.headers[app.backend.headerNames.token] = app.id;
					p.headers[app.backend.headerNames.hash] = app.backend.createAccessHash(p);

					return p;
				},
				errorCodeModel: errorCodeModel
			});

			// try to connect to the backend and fetch the error codes
			errorCodeModel.fetch({
				parse: true,
				error: function (model, error) {
					var displayError;
					if (error.isServerError && error.errorCode === 18) {
						// system access was unauthorized
						displayError = {
							type: 'error',
							title: "Insecure Client",
							text: "Your version of TouchTheBeat was blocked due to security concerns. If you think that was a mistake, please contact me."
						};
					}
					else {
						// default error, e.g. error 404 or any error indicating the user is offline or the backend is unreachable.
						displayError = {
							type: 'error',
							title: "Connection to the TouchTheBeat-Backend failed",
							text: "Please try again later or contact me, if the error still occures."
						};
					}
					app.getMainView().alert(displayError);
				}
			});
		},

		/**
		 * - configures backend
		 * - checks environment compability
		 * - tries to restore a session
		 * - calls router's init method
		 * @method init
		 * @param {Object} config
		 * The content of the config module.
		 */
		init: function (config) {
			_.extend(this, config);
			this.connectToBackend();

			// adding an instance of AudioContext to the app object that will be used by every instance of AudioController
			try {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.audiocontext = new window.AudioContext();
			}
			catch (e) {
			}

			console.log(this.getCompabilityReport());
			this.session.restore();
			this.router.init();
		}
	});
	app = new App();
	return app;
});