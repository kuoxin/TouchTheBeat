define([
	'jquery',
	'underscore',
	'Framework',
	'models/Level'
], function ($, _, Framework, Level) {
	var LevelCollection = Framework.PageableCollection.extend({
		model: Level,

		url: 'levels',

		queryParams: {
			pageSize: "limit",
			// Setting a parameter mapping value to null removes it from the query string
			currentPage: null,
			// Any extra query string parameters are sent as is, values can be functions,
			// which will be bound to the pageable collection instance temporarily
			// when called.
			offset: function () {
				return this.state.currentPage * this.state.pageSize;
			}
		},

		state: {
			firstPage: 0,
			pageSize: 0
		},

		initialize: function () {
		}
	});
	return LevelCollection;
});

