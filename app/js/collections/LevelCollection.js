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

		parse: function (data, options) {
			"use strict";

			/**
			 * This property is set to make it possible for the level to know whether it is currently updated from a fetch of its collection or fetch of the single resource.
			 * It is important to know that, because the level resource does not contain the gameObjects when fetched indirectly by fetching its collection.
			 * Once a level has loaded its gameObjects, they should not get reset as soon as the collection gets fetched again.
			 */
			options.fetchFromCollection = true;

			return data;
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

