define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/highscore.html',
  'bootstrap',
  
], function ($, _, Backbone, highscoreTemplate) {
	var HighScoreView = Backbone.View.extend({
		el: '#content',
		events : {
			'click #gotoChooseLevelView' : 'gotoChooseLevelView'
		},
		render: function (game) {
			this.game = game;
			var template = _.template(highscoreTemplate, {highscore : this.game.highscore, levelname : this.game.level.levelname});
			this.$el.html(template);
		},

		gotoChooseLevelView : function (){
			Backbone.history.navigate('chooselevel');
			window.location.reload();
		}
	});
	return HighScoreView;
});