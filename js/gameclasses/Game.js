define([
    'jquery',
    'underscore',
    'backbone',
    'gameclasses/Surface',
    'gameclasses/TapObject'
], function ($, _, Backbone, Surface, TapObject) {

    var Game = function (level, audiocontroller) {
        this.audiocontroller = audiocontroller;
        console.log(level);
        this.level = level.toJSON();
        this.gameObjects = [];
        this.setup();
        this.surface = new Surface(
            {bgcolor: '#000000'}
        );
        this.surface.requestStartFromUser(this.audiocontroller.start.bind(this.audiocontroller));
    };

    Game.prototype = {
        width: 1600,
        height: 1200,
        taptimeframe: 10,
        playview: null,

        setup: function () {
            console.log('setting up game');
            console.log(this.level);
            for (var i = 0; i < this.level.gameObjects.length; i++) {
                var gameObject = this.level.gameObjects[i];
                switch (gameObject.type) {
                    case 'Tap':
                        this.gameObjects.push(new TapObject(this, gameObject.tapTime, gameObject.x, gameObject.y, gameObject.shape));
                        break;
                    default:
                        console.error("undefined gameObject detected")
                }
            }
        },

        getRandomInteger: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getTime: function () {
            return this.audiocontroller.getCurrentTime();
        },

        update: function () {
            if (!this.stopped) {
                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].update(this.getTime());
                }
            }
        },

        updateView: function (timestamp) {
            if (!this.stopped) {
                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].render(timestamp);
                }
                requestAnimationFrame(this.updateView.bind(this));
            }
        },

        start: function () {
            this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
            this.updateView(this.getTime());
        },

        stop: function () {
            clearInterval(this.updateinterval);
            this.stopped = true;
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

    };

    return Game;
});