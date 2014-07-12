define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/highscore.html',
    'app',
  'bootstrap'
], function ($, _, Backbone, highscoreTemplate, app) {
	var HighScoreView = Backbone.View.extend({
        el: '#content',
		events : {
			'click #btn_gotoChooseLevelView' : 'gotoChooseLevelView',
            'click #btn_playagain' : 'playagain'
		},
		render: function (game) {
            Backbone.history.navigate('highscore', false);

            this.game = game;
            var template = _.template(highscoreTemplate, {highscore: this.game.highscore, levelname: this.game.level.levelname});
            this.$el.html(template);
		},

		gotoChooseLevelView : function (){
			Backbone.history.navigate('chooselevel', true);
		},

        playagain : function(){
            console.log(this.game);
            app.startlevel(this.game.level);
        }


	});
	return HighScoreView;
});