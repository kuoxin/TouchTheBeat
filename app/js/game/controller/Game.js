define([
    'jquery',
    'underscore',
    'Framework',
    'game/controller/TapObject',
    'game/controller/HUD'
], function ($, _, Framework, TapObject, HUD) {
    "use strict";

    /**
     * The main game controller that has to be initialized with a json data parameter containing these childs:
     * audiocontroller,
     * level,
     * surface
     *
     * @type {*|void}
     */
    var Game = Framework.Controller.extend({
        updateintervall: null,
        stopped: true,

        initialize: function (data) {
            this.gameObjects = [];
            this.audiocontroller = data.audiocontroller;
            this.surface = data.surface;
			this.level = data.level;
			this.playCounterIncremented = false;
			var gameObjects = this.level.get('gameObjects').toJSON();

            this.hud = new HUD(this);

			for (var i = 0; i < gameObjects.length; i++) {
				var gameObject = gameObjects[i];
                switch (gameObject.type) {
                    case 'Tap':
                        this.gameObjects.push(new TapObject(this, gameObject.tapTime, gameObject.x, gameObject.y, gameObject.shape));
                        break;
                    default:
                        console.error("undefined gameObject detected");
                }
            }
        },

        getTime: function () {
            return this.audiocontroller.getCurrentTime();
        },

		getDuration: function(){
			return this.audiocontroller.getDuration();
		},

        update: function () {
            if (!this.stopped) {
                //update gameobjects

                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].update(this.getTime());
                }
            }
			if (!this.playCounterIncremented && (this.getTime() > this.getDuration()/2)){
				this.level.incrementPlayCounter();
				this.playCounterIncremented = true;
			}
        },

        updateView: function () {
            if (!this.stopped) {
                this.hud.render(this.getTime());
                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].render(this.getTime());
                }
                requestAnimationFrame(this.updateView.bind(this));
            }
        },

        start: function () {
			this.resume();
        },

		resume: function () {
			this.trigger('resume');

			this.stopped = false;
			this.audiocontroller.play();
			this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
			this.updateView(this.getTime());
		},

        pause: function () {
			this.trigger('pause');

            this.audiocontroller.pause();
            this.stop();
        },

        stop: function () {
            clearInterval(this.updateinterval);
            this.stopped = true;
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
