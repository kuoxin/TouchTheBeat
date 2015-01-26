/**
 * This is the main view of TouchTheBeat. It is instanciated once and exists in the app module
 * @module views
 * @class MainView
 *
 */
define([
	'jquery',
	'underscore',
	'Framework',
	'bootstrap-sweetalert',
	'views/MenuView',
	'views/HomeView',
	'views/ChooseLevelView',
	'views/AppView',
	'views/PageNotFoundView',
	'views/LegalView',
	'views/PlayView',
	'views/HighScoreView',
	'views/levelbuilder/BaseView',
	'snackbarjs'
], function ($, _, Framework, SweetAlert, MenuView, HomeView, ChooseLevelView, AppView, PageNotFoundView, LegalView, PlayView, HighScoreView, LevelBuilderBaseView) {
	var MainView = Framework.View.extend({
		el: 'html',

		currentView: null,

		initialize: function () {
			"use strict";
			this.alertQueue = [];
			this.views = {
				current: null,
				appview: new AppView(),
				homeview: new HomeView(),
				chooselevelview: new ChooseLevelView(),
				pagenotfoundview: new PageNotFoundView(),
				legalview: new LegalView(),
				playlevelview: new PlayView(),
				highscoreview: new HighScoreView(),
				levelbuilderview: new LevelBuilderBaseView()
			};

			// load the bootstrap-sweet-alert library on document ready and then show the alerts that were triggered already
			var that = this;
			$(function () {
					for (var i = 0; i < that.alertQueue.length; i++) {
						that.alert(that.alertQueue[i]);
					}
					that.alertQueue = [];
			});
		},

		render: function () {
			console.log('mainview rendered');
			this.alert('test');
		},

		/**
		 * @property {boolean} appViewIsRendered
		 */
		appViewIsRendered: false,

		/**
		 * @method setFullScreenContent
		 * @param {View} view
		 * @param [...]
		 * all other params will be passed to the views render() function
		 */
		setFullScreenContent: function () {
			this.appviewIsRendered = false;
			this.currentView.close();
			this.views.appview.onClose();

			this.currentView = [].shift.call(arguments);
			this.currentView.setElement('body').render.apply(this.currentView, arguments);
		},

		/**
		 * shows an alert using the bootstrap-sweet-alert library. (https://lipis.github.io/bootstrap-sweetalert/)
		 * @method alert
		 * @param {Object} options (refer to https://lipis.github.io/bootstrap-sweetalert/ for examples)
		 */
		alert: function () {
			"use strict";
			if (window.swal) {
				window.swal(_.clone(arguments[0]));
			}
			else {
				//save the alert call and run it when the alerting-functionality has loaded.
				this.alertQueue.push(arguments[0]);
			}
		},

		/**
		 * shows a snackbarjs notification by passing all arguments to $.snackbar
		 * @method notify
		 * @param {Object} options refer to https://github.com/FezVrasta/snackbarjs for examples
		 */
		notify: function () {
			$.snackbar(_.defaults({
				timeout: 7000
			}, arguments[0]));
		},

		/**
		 * @method getAppView
		 * @returns {AppView} this.views.appview
		 */
		getAppView: function () {
			"use strict";
			return this.views.appview;
		},

		/**
		 * This method is used for navigation between contents in the app.
		 * @method setContent
		 * @param {View} view
		 * @param [...]
		 * all other params will be passed to the views render() function
		 */
		setContent: function (newview, args) {
			var views = this.views;

			//if (this.currentView == newview) {
			//	return;
			//}

			if (this.currentView !== null) {
				this.currentView.close();
			}

			if (!this.appviewIsRendered) {
				views.appview.render();
				this.appviewIsRendered = true;
			}

			this.currentView = newview;
			this.currentView.render.apply(this.currentView, args);
			views.appview.setContent(this.currentView.el);
		}
	});
	return MainView;
});
