define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
	var initialize = function (options) {
		"use strict";
		var ErrorCodeModel = Backbone.Model.extend({
			url: 'system/codes',
			parse: function (data) {
				return _.invert(data);
			}
		});

		var errorCodeModel = new ErrorCodeModel();

		var realajax = Backbone.ajax;
		Backbone.ajax = function (p) {
			var customizedParams = options.onAjaxPrepare(_.clone(p));
			var url = options.host + customizedParams.url;

			console.log(customizedParams);

			customizedParams.success = function (response, p2, p3) {
				if (typeof response.data !== 'undefined' && response.data !== null && !response.error) {
					console.info(customizedParams.string + ' was successfull.');
					p.success(response.data, p2, p3);
				} else {
					console.warn(customizedParams.string + ' returned an error: "' + errorCodeModel.get(response.error) + '"');
					p.error(errorCodeModel.get(response.error) || response.error);
				}
			};

			customizedParams.error = function (jqXHR) {
				console.error(customizedParams.string + ' failed. (' + jqXHR.status + ')');
				p.error(jqXHR.status);
			};

			realajax(url, customizedParams);
			console.info(customizedParams.string + ' raised');
		};

		errorCodeModel.fetch({
			parse: true
		});
	};
	return {
		setupBackend: initialize
	};

});