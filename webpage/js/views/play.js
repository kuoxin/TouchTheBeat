define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/play.html',
  'snap',
  'utils/SoundEngine',
  'views/applicationwithmenu',
  'views/highscore',
  'gameclasses/Surface',
  'gameclasses/TapObject',
  '../utils/scripts',

], function ($, _, Backbone, playTemplate, Snap, SoundEngine, ApplicationWithMenuView, HighScoreView, Surface,TapObject) {
	var PlayView = Backbone.View.extend({
		el: '#body',
		time: 0,
		endtime: 0,
		gameobjects: [],
		stopped: true,
		game : {},

		render: function (level, returntoview) {
			this.level = level;
			var template = _.template(playTemplate, {});
			this.$el.html(template);
			this.returntoview = returntoview;

			this.surface = new Surface(this);

			for (var i = 1; i < 5; i++) {
				this.gameobjects.push(new TapObject(this.surface, i*1000));
			}

			console.log(this.gameobjects);

			this.start();

		},

		start: function () {
			//TODO Countdown / Smooth Transition to playing
			this.starttime =  new Date().getTime();
			this.endtime = this.starttime + 5000;
			this.stopped = false;
			console.log('now running');

			this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
			//this.updateView();
		},

		getTimeDelta : function(){
			return new Date().getTime() - this.starttime;
		},


		update: function () {
			if (this.getTimeDelta()+this.starttime >= this.endtime) {
				this.stop();
			}

			for (var i = 0; i < this.gameobjects.length; i++) {
				this.gameobjects[i].update(this.getTimeDelta());
			}


		},

/*		updateView: function () {
			if (!this.stopped) {
				for (var i = 0; i < this.gameobjects.length; i++) {
					gameobjects[i].updateView(this.getTimeDelta());
				}
				requestAnimationFrame(this.updateView.bind(this));
			}
		},*/

		stop: function () {
			clearInterval(this.updateinterval);
			this.stopped = true;
			console.log("now stopped");
			console.log('length: '+this.getTimeDelta());
			console.log(this);

			$('#svg').fadeOut(1000);

			var game = {};

			game.highscore = this.calculateHighScore();
			game.level = this.level;

			setTimeout(function(){
				//TODO: Smooth transition to HighScore View
				var applicationwithmenuview = new ApplicationWithMenuView();
				applicationwithmenuview.render();
				var highscoreview = new HighScoreView();
				highscoreview.render(game);
			}, 1500)
			
		},

		calculateHighScore: function () {
			//var highscores = [];
			var highscoresum = 0;

			for (var i = 0; i < this.gameobjects.length; i++){
				//highscores.push(this.gameobjects[i].getHighScore());
				highscoresum += this.gameobjects[i].getHighScore();
			}

			var highscoreaverage = highscoresum / this.gameobjects.length;
			var highscore = (highscoreaverage*100).toFixed(1)+'%';

			console.log('HighScore: '+highscore);

			return highscore;
		}



	});
	return PlayView;
});