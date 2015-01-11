define(['jquery', 'underscore', 'backbone', 'framework/Controller'], function ($, _, Backbone, Controller) {

	/**
	 * The Backend is a Controller that functions as an interface to the TouchTheBeat Backend
	 * @class Backend
	 * @extends Controller
	 * @constructor
	 * @param app {App}
	 *
	 */
	var Backend;
	(function () {
		"use strict";

		/**
		 * the createAccessHash method as defined in config
		 * @method createAccessHash
		 * @private
		 * @static
		 */
		var createAccessHash,

			/**
			 * a instance reference
			 * @property self
			 * @static
			 * @private
			 */
			self,

			/**
			 * the original jQuery ajax function as found at Backbone.ajax
			 * @type {Function|*|Backbone.ajax}
			 * @static
			 * @private
			 */
			realajax = Backbone.ajax;


		/**
		 * @method setHeader
		 * @private
		 * @static
		 * @param request {Object}
		 * The request object as it will be passed to the realajax method
		 * @param name {String}
		 * The name of the header
		 * @param value {String}
		 * The value of the header
		 */
		function setHeader(request, name, value) {
			request.headers[name] = value;
		}

		/**
		 * This method sets a header and gets the header name from the config key-value pairs.
		 * @method setNamedHeader
		 * @private
		 * @static
		 * @param request {Object}
		 * The request object as it will be passed to the realajax method
		 * @param name {String}
		 * The name of the header
		 * @param value {String}
		 * The value of the header
		 */
		function setNamedHeader(request, name, value) {
			setHeader(request, self.headerNames[name], value);
		}

		/**
		 * This method sets headers and other parameters needed for every backend request.
		 * @private
		 * @static
		 * @method prepareAjaxRequest
		 * @param request {Object}
		 * @returns request {Object}
		 */
		function prepareAjaxRequest(request) {
			setHeader(request, 'Accept', "application/json;charset=UTF-8");
			setHeader(request, 'Content-Type', "application/json;charset=UTF-8");

			request.string = _.uniqueId('API-Request') + ' "' + request.type + ' ' + request.url;

			if (typeof self.session !== 'undefined' && self.session !== null && self.session.has('hash')) {
				request.string += ' with sessionID';
				setNamedHeader(request, 'session', self.session.get('hash'));
			}

			setNamedHeader(request, 'timestamp', Date.now() / 1000);
			setNamedHeader(request, 'token', self.clientID);
			setNamedHeader(request, 'hash', createAccessHash(request));

			request.url = self.host + request.url;

			return request;
		}

		/**
		 * This method passes the backend error information in a unified format to the error callback.
		 * @private
		 * @static
		 * @method passServerError
		 * @param request {Object}
		 * @param response {Object}
		 * The jsonResponse from jquery Ajax
		 * @param errorCallback {Function}
		 */
		function passServerError(request, response, errorCallback) {
			var errorCode = self.errorCodeModel.get(response.error) || response.error;
			var errorMessage = response.error_message;
			console.warn(request.string + ' returned an error: ' + errorCode + ' ( ' + errorMessage + ' )');
			errorCallback({
				errorCode: errorCode,
				errorMessage: errorMessage,
				errorData: response.error_data,
				isServerError: true
			});
		}

		Backend = Controller.extend({

			/**
			 * configures the client for backend communication by
			 * - setting up a clientID
			 * - preparing an ErrorCodeModel
			 * - reading the backend host and headerNames from the config
			 * - preparing session for later use
			 * - overwriting the Backbone.ajax method with the Backends makeRequest method for error handling
			 * @method initialize
			 * @param app {App}
			 */
			initialize: function (app) {
				createAccessHash = app.config.backend.createAccessHash;

				this.headerNames = app.config.backend.headerNames;
				this.session = app.session;
				this.errorCodeModel = app.errorCodes;
				this.host = app.config.backend.host;

				this.clientID = (function () { // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
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

				Backbone.ajax = this.makeRequest;
				self = this;
			},

			/**
			 * fetches the ErrorCodes from the Backend and stores them in the ErrorCodeModel
			 * @method connect
			 */
			connect: function () {
				// try to connect to the backend and fetch the error codes
				this.errorCodeModel.fetch({
					parse: true,
					error: function (model, error) {
						if (error.isServerError && error.errorCode === 18) {
							// system access was unauthorized
							self.trigger('client-unauthorized');
						}
						else {
							// default error, e.g. error 404 or any error indicating the user is offline or the backend is unreachable.
							self.trigger('offline');
						}
						//app.getMainView().alert(displayError);
					}
				});
			},

			/**
			 * The central method for making backend request. It is a layer above the jQuery ajax method (http://api.jquery.com/jquery.ajax/) and extends the passed settings object with various values / headers needed for every request to the TouchTheBeat backend.
			 * @method makeRequest
			 * @param settings {Object}
			 * The settings object as defined here: http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings.
			 * The url property is relative to the host specified in the config module: (e.g. set settings.url to ``levels``, not ``http://example.com/levels``)
			 */
			makeRequest: function (settings) {
				_.defaults(settings, {
					headers: {},
					success: function () {
					},
					error: function () {
					},
					url: '',
					type: 'GET'
				});

				var request = prepareAjaxRequest(_.clone(settings));

				request.success = function (response, p2, p3) {
					if (typeof response.data !== 'undefined' && response.data !== null && !response.error) {
						console.info(request.string + ' was successfull.');
						settings.success(response.data, p2, p3);
					} else {
						passServerError(request, response, settings.error);
					}
				};

				request.error = function (jqXHR) {
					if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
						passServerError(request, jqXHR.responseJSON, settings.error);
					}
					else {
						var errorCode = jqXHR.status;
						var errorMessage = jqXHR.statusText;
						console.error(request.string + ' failed: ' + errorCode + ' (' + errorMessage + ')');
						settings.error({
							errorCode: errorCode,
							errorMessage: errorMessage,
							isServerError: false
						});
					}
				};

				realajax(request.url, request);
				console.info(request.string + ' raised');
			},

			/**
			 * a convenience method that is passing the settings to  makeRequest internally to make a HTTP POST request
			 * @method post
			 * @param settings {Object}
			 */
			post: function (request) {
				this.makeRequest(_.extend(request || {}, {
					type: 'POST'
				}));
			},

			/**
			 * a convenience method that is passing the settings to  makeRequest internally to make a HTTP GET request
			 * @method get
			 * @param settings {Object}
			 */
			get: function (request) {
				this.makeRequest(_.extend(request || {}, {
					type: 'GET'
				}));
			},

			/**
			 * a convenience method that is passing the settings to  makeRequest internally to make a HTTP PUT request
			 * @method put
			 * @param settings {Object}
			 */
			put: function (request) {
				this.makeRequest(_.extend(request || {}, {
					type: 'PUT'
				}));
			},

			/**
			 * a convenience method that is passing the settings to  makeRequest internally to make a HTTP DELETE request
			 * @method delete
			 * @param settings {Object}
			 */
			delete: function (request) {
				this.makeRequest(_.extend(request || {}, {
					type: 'DELETE'
				}));
			}
		});
	})();

	return Backend;

});
