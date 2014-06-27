define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/highscore.html',
  'views/PlayView',
  'bootstrap'
], function ($, _, Backbone, highscoreTemplate, PlayView) {
	var HighScoreView = Backbone.View.extend({
		el: '#content',
		events : {
			'click #btn_gotoChooseLevelView' : 'gotoChooseLevelView',
            'click #btn_playagain' : 'playagain'
		},
		render: function (game) {
			this.game = game;
			var template = _.template(highscoreTemplate, {highscore : this.game.highscore, levelname : this.game.level.levelname});
			this.$el.html(template);
		},

		gotoChooseLevelView : function (){
			Backbone.history.navigate('chooselevel', true);
			window.location.reload();
		},

        playagain : function(){
            console.log(this.game);
            new PlayView().render(this.game.level);
        }


	});
	return HighScoreView;
});