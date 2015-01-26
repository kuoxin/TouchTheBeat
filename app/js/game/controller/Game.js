define([
    'jquery',
    'underscore',
    'Framework',
    'game/controller/TapObject',
	'game/renderer/GameRenderer',
    'game/controller/HUD'
], function ($, _, Framework, TapObject, GameRenderer, HUD) {
    "use strict";

    /**
     * The main game controller that has to be initialized with a json data parameter containing these childs:
     * audiocontroller,
     * level,
     * surface
     *
     * @type {*|void}
     */
	var Game = Framework.GameObject.extend({
        updateintervall: null,
        stopped: true,

        initialize: function (data) {
            this.gameObjects = [];
            this.audiocontroller = data.audiocontroller;
            this.surface = data.surface;
			this.gameObjectGroup = this.surface.getSnap().group();
			this.level = data.level;
			this.playCounterIncremented = false;

			var gameObjects = this.level.get('gameObjects').toJSON();
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

			this.hud = new HUD(this);
			this.setRenderer(new GameRenderer({
				snap: this.surface.getSnap(),
				controller: this
			}));
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

		triggerRendering: function () {
            if (!this.stopped) {
				this.render(this.getTime());
				requestAnimationFrame(this.triggerRendering.bind(this));
            }
        },

        start: function () {
			this.resume(true);
        },

		resume: function (isStart) {
			if (!isStart) {
				this.trigger('resume');
			}

			this.stopped = false;
			this.audiocontroller.play();
			this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
			this.triggerRendering();
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
