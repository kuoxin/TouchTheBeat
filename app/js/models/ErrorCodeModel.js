define(['underscore', 'Framework'], function (_, Framework) {
	"use strict";
	/**
	 * The ErrorCodeModel contains the error codes from the backend as key value pairs. It gets used in framework/API
	 * @module models
	 * @class ErrorCodeModel
	 * @extends Model
	 * @type {*|void}
	 */
	var ErrorCodeModel = Framework.Model.extend({
		url: 'system/codes',
		parse: function (data) {
			return _.invert(data);
		}
	});

	return ErrorCodeModel;


});
