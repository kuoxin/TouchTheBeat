define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
	return {
		setupBackend: function (options) {
			"use strict";
			var errorCodeModel = options.errorCodeModel;

			var realajax = Backbone.ajax;

			Backbone.ajax = function (p) {
				var customizedParams = _.clone(p);
				customizedParams.headers = _.extend(customizedParams.headers || {}, {
					"Accept": "application/json;charset=UTF-8",
					"Content-Type": "application/json;charset=UTF-8"
				});
				customizedParams.url = options.host + customizedParams.url;
				customizedParams = options.onAjaxPrepare(customizedParams);

				customizedParams.success = function (response, p2, p3) {
					if (typeof response.data !== 'undefined' && response.data !== null && !response.error) {
						console.info(customizedParams.string + ' was successfull.');
						p.success(response.data, p2, p3);
					} else {
						var errorCode = errorCodeModel.get(response.error) || response.error;
						var errorMessage = response.error_message;
						console.warn(customizedParams.string + ' returned an error: ' + errorCode + ' ( ' + errorMessage + ' )');
						console.log(response);
						p.error({
							errorCode: errorCode,
							errorMessage: errorMessage,
							isServerError: true
						});
					}
				};

				customizedParams.error = function (jqXHR) {
					var errorCode = jqXHR.status;
					var errorMessage = jqXHR.statusText;
					console.error(customizedParams.string + ' failed: ' + errorCode + ' (' + errorMessage + ')');
					p.error({
						errorCode: errorCode,
						errorMessage: errorMessage,
						isServerError: false
					});
				};

				realajax(customizedParams.url, customizedParams);
				console.info(customizedParams.string + ' raised');
			};
		}
	};

});