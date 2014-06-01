define([
	'jquery',
	'underscore',
	'backbone',
	'views/menu',
	'views/home',
	'views/levelbuilder',
	'views/play'
], function($, _, Backbone, MenuView, HomeView, LevelBuilderView, PlayView){
  var Router = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      	'' : 'home',
		'play' : 'play',
		'buildlevel' : 'levelgenerator',

      // Default
      '*actions': 'defaultAction'
    }
  });
	
	var menu = new MenuView();

  var initialize = function(){
    var router = new Router;
	  
	router.on('route:home', function() {
		menu.render('home');
		var homeview = new HomeView();
		homeview.render();
	});
	
	router.on('route:play', function() {
		menu.render('play');
		var playview = new PlayView();
		playview.render();
	});
	
	router.on('route:levelgenerator', function() {
		menu.render('buildlevel');
		var levelbuilderview = new LevelBuilderView();
		levelbuilderview.render();
	});
	  
    router.on('defaultAction', function(actions){
      console.log('No route:', actions);
    });
	  
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});