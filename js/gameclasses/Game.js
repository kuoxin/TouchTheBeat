define([
    'jquery',
    'underscore',
    'backbone',
    'gameclasses/Surface',
    'gameclasses/TapObject'
], function ($, _, Backbone, Surface, TapObject) {

    var Game = function (level, audiocontroller) {
        this.audiocontroller = audiocontroller;
        this.level = level;
        this.gameobjects = [];
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
            for (i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];
                switch (gameobject.type) {
                    case 'Tap':
                        this.gameobjects.push(new TapObject(this, gameobject.taptime, gameobject.x, gameobject.y));
                        break;
                    default:
                        console.error("undefined gameobject detected")
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
                for (var i = 0; i < this.gameobjects.length; i++) {
                    this.gameobjects[i].update(this.getTime());
                }
            }
        },

        updateView: function (timestamp) {
            if (!this.stopped) {
                for (var i = 0; i < this.gameobjects.length; i++) {
                    this.gameobjects[i].render(timestamp);
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
        },

        calculateHighScore: function () {
            //var highscores = [];
            var highscoresum = 0;

            for (var i = 0; i < this.gameobjects.length; i++) {
                //highscores.push(this.gameobjects[i].getHighScore());
                highscoresum += this.gameobjects[i].getHighScore();
            }

            var highscoreaverage = highscoresum / this.gameobjects.length;

            return (highscoreaverage * 100).toFixed(1) + '%';
        }

    };

    return Game;
});