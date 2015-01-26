define([
	'jquery',
	'underscore',
	'Framework',
	'text!templates/gamemenu.html',
	'app'
], function ($, _, Framework, homeTemplate, app) {
	var GameMenuView = Framework.View.extend({
		className: 'gameMenu',
		initialize: function (game) {
			this.game = game;
		},

		render: function () {
			var template = _.template(homeTemplate, {});
			this.$el.html(template);
			return this;
		},

		events: {
			'click #resume': 'onResumeButtonClick',
			'click #restart': 'onRestartButtonClick',
			'click #exit': 'onExitButtonClick'
		},

		onRestartButtonClick: function () {
			app.startLevel(this.game.level);
		},

		onExitButtonClick: function () {
			app.showAppContent('chooselevel');
		},

		onResumeButtonClick: function () {
			this.game.resume();
		},

		open: function () {
			this.$el.addClass('gameMenuOpen');
		},

		close: function () {
			this.$el.removeClass('gameMenuOpen');
		}
	});
	return GameMenuView;
});
