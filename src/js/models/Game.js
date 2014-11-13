define([
	'jquery',
	'underscore',
	'backbone',
	'gameclasses/TapObject',
	'gameclasses/Surface'
], function ($, _, Backbone, TapObject, Surface) {
	"use strict";
	var Game = Backbone.Model.extend({
		updateintervall: null,

		defaults: {
			stopped: true
		},

// audiocontroller, level
		initialize: function () {
			this.surface = new Surface(
				{bgcolor: '#000000'}
			);
			this.gameObjects = [];

			var level = this.get('level').toJSON();
			console.log(level);

			for (var i = 0; i < level.gameObjects.length; i++) {
				var gameObject = level.gameObjects[i];
				switch (gameObject.type) {
					case 'Tap':
						this.gameObjects.push(new TapObject(this, gameObject.tapTime, gameObject.x, gameObject.y, gameObject.shape));
						break;
					default:
						console.error("undefined gameObject detected");
				}
			}

			// auslagern
			this.surface.requestStartFromUser(this.get('audiocontroller').start.bind(this.get('audiocontroller')));
		},

		getTime: function () {
			return this.get('audiocontroller').getCurrentTime();
		},

		update: function () {
			if (!this.get('stopped')) {
				//update gameobjects

				for (var i = 0; i < this.gameObjects.length; i++) {
					this.gameObjects[i].update(this.getTime());
				}
			}
		},

		updateView: function (timestamp) {
			if (!this.stopped) {
				for (var i = 0; i < this.gameObjects.length; i++) {
					this.gameObjects[i].render(this.getTime());
				}
				requestAnimationFrame(this.updateView.bind(this));
			}
		},

		start: function () {
			this.set('stopped', false);
			console.log('startet game');
			this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
			this.updateView(this.getTime());
		},

		stop: function () {
			clearInterval(this.updateinterval);
			this.set('stopped', true);
			console.log("stopped game");
		},

		calculateHighScore: function () {
			//var highscores = [];
			var highscoresum = 0;

			for (var i = 0; i < this.gameObjects.length; i++) {
				//highscores.push(this.gameObjects[i].getHighScore());
				highscoresum += this.gameObjects[i].getHighScore();
			}

			var highscoreaverage = highscoresum / this.gameObjects.length;

			return (highscoreaverage * 100).toFixed(1) + '%';
		}


	});

	return Game;
});