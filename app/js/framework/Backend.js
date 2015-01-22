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
			passError(request, {
				errorCode: self.errorCodeModel.get(response.error) || response.error,
				errorMessage: response.error_message,
				errorData: response.error_data,
				request: request,
				isServerError: true
			}, errorCallback);
		}

		/**
		 * This method passes the error information to the error callback and
		 * triggeres an error event if the callback does not indicate that it handled the error
		 * (by setting the 'handled' property on the errorObject to true)
		 * @param request {Object}
		 * @param errorObject {Object} the error object
		 * @param errorCallback {Function} the specific error handler function
		 */
		function passError(request, errorObject, errorCallback) {

			var logDescription = errorObject.errorCode + ' ( ' + errorObject.errorMessage + ' )';
			if (errorObject.isServerError) {
				console.warn(request.string + ' returned an error: ' + logDescription);
			}
			else {
				console.error(request.string + ' failed: ' + logDescription);
			}

			_.extend(errorObject, {handled: false});

			errorCallback(errorObject);

			if (!errorObject.handled) {
				self.trigger(errorObject.errorCode, errorObject, request);
			}
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
							self.trigger('clientIsUnauthorized');
						}
						else {
							// default error, e.g. error 404 or any error indicating the user is offline or the backend is unreachable.
							self.trigger('clientIsOffline');
						}
						error.handled = true;
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
					// the ajax request was successfull, now checking if the backend actually returned an error
					if (typeof response.data !== 'undefined' && response.data !== null && !response.error) {
						console.info(request.string + ' was successfull.');
						settings.success(response.data, p2, p3);
					} else {
						passServerError(request, response, settings.error);
					}
				};

				request.error = function (jqXHR) {
					if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
						// the error was sent from the backend
						passServerError(request, jqXHR.responseJSON, settings.error);
					}
					else {
						// the error was not sent from the backend
						var errorObject = {
							errorCode: jqXHR.status,
							errorMessage: jqXHR.statusText,
							isServerError: false,
							request: request
						};

						passError(request, errorObject, settings.error);
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
