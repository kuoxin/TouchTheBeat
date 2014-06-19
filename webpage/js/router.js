define([
	'jquery',
	'underscore',
	'backbone',
	'views/menu',
	'views/home',
	'views/levelbuilder',
	'views/chooselevel',
	'views/applicationwithmenu',
    'views/PageNotFoundView'
], function ($, _, Backbone, MenuView, HomeView, LevelBuilderView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView) {
	var Router = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'home',
			'chooselevel': 'chooselevel',
			'buildlevel': 'levelgenerator',

			// Default
			'*notfound': 'notfound'
		}
	});
	
	


    //TODO: Better Navigation, make the menu to use the router

	var initialize = function () {
		var router = new Router;
		this.applicationwithmenuview = new ApplicationWithMenuView();
		this.applicationwithmenuview.render();

        var menu = this.applicationwithmenuview.getMenu();

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

		router.on('route:notfound', function (actions) {
			console.log('No route:', actions);
            var pagenotfoundview = new PageNotFoundView();
            pagenotfoundview.render();
            var homeview = new HomeView();
            homeview.render();
            menu.updateMenuState('home');
		});

		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});