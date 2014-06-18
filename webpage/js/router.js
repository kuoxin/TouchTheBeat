define([
	'jquery',
	'underscore',
	'backbone',
	'views/menu',
	'views/home',
	'views/levelbuilder',
	'views/chooselevel',
	'views/applicationwithmenu'
], function ($, _, Backbone, MenuView, HomeView, LevelBuilderView, ChooseLevelView, ApplicationWithMenuView) {
	var Router = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'home',
			'chooselevel': 'chooselevel',
			'buildlevel': 'levelgenerator',

			// Default
			'*actions': 'defaultAction'
		}
	});
	
	



	var initialize = function () {
		var router = new Router;
		var applicationwithmenuview = new ApplicationWithMenuView();
		applicationwithmenuview.render();
		var menu = new MenuView();
		menu.render();

		router.on('route:home', function () {
			menu.updateMenuState('home');
			var homeview = new HomeView();
			homeview.render();
		});

		router.on('route:chooselevel', function () {
			menu.updateMenuState('chooselevel');
			var chooselevel = new ChooseLevelView();
			chooselevel.render();
		});

		router.on('route:levelgenerator', function () {
			menu.updateMenuState('buildlevel');
			var levelbuilderview = new LevelBuilderView();
			levelbuilderview.render();
		});

		router.on('defaultAction', function (actions) {
			console.log('No route:', actions);
		});

		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});