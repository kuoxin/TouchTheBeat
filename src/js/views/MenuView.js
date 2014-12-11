define([
	'jquery',
	'underscore',
	'Framework',
	'text!templates/menu.html',
	'views/SignInMenuButtonView',
	'views/UserMenuButtonView',
	'app',
	'framework/ExchangeableContent',
	'lib/bootstrap'
], function ($, _, Framework, menuTemplate, SignInMenuButtonView, UserMenuButtonView, app, ExchangeableContent) {
	var MenuView = Framework.View.extend(
		_.extend(new ExchangeableContent(), {
			initialize: function () {
				"use strict";
				this.configureExchangableContents({
					className: 'usermenucontainer',
					contentsareinstances: true
				});
				this.addContents({
					nosession: new SignInMenuButtonView(),
					session: new UserMenuButtonView()
				});
			},

			render: function () {
				var template = _.template(menuTemplate, {});
				this.$el.html(template);
				this.changeLoggedInState(app.session);
				this.listenTo(Framework.history, 'route', this.updateMenuState.bind(this));
				this.listenTo(app.session, 'change:logged_in', this.changeLoggedInState.bind(this));
				return this;
			},

			menustates: {
				'createlevel': 'levelbuilder',
				'editlevel': 'levelbuilder',
				'buildlevel': 'levelbuilder'
			},

			events: {
				'click .navbar-collapse ul li a:not(.dropdown-toggle)': 'changeMenuVisibility'
			},

			changeMenuVisibility: function () {
				this.$('.navbar-toggle:visible').click();
			},

			changeLoggedInState: function (session) {
				if (session.get('logged_in')) {
					this.setContent('session');
				}
				else
					this.setContent('nosession', ['navbar-btn']);
			},

			updateMenuState: function (router, route) {
				var activeitem_old = $('.active');
				if (activeitem_old !== null)
					activeitem_old.removeClass('active');

				var activeitem_new = $('#' + (this.menustates[route] || route));
				if (activeitem_new !== null)
					activeitem_new.addClass('active');
			}
		}));
	return MenuView;
});