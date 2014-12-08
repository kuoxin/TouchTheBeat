define([
	'jquery',
	'underscore',
	'backbone',
	'models/Level',
	'levelcontainer',
	'app'
], function ($, _, Backbone, Level, levelcontainer, app) {
	var UserLevelCollection = Backbone.Collection.extend({
		model: Level,

		url: function () {
			var userurl;
			try {
				userurl = app.session.get('user').url();
			}
			catch (e) {
				userurl = 'user';
			}
			return userurl + "/levels";
		}
	});
	return UserLevelCollection;
});