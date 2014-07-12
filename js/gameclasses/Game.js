define([
    'jquery',
    'underscore',
    'backbone',
    'snap',
    'gameclasses/TapObject'
], function ($, _, Backbone, Snap, TapObject) {

    var Game = function (playview) {
        this.playview = playview;
        this.level = this.playview.level;
        this.gameobjects = [];
        this.snap = new Snap('#svg');
        var r = this.snap.rect(0, 0, "100%", "100%", 0);

        r.attr({
            fill: '#6699FF'
        });

        r.touchend(function () {
            console.log("touchend on surface");
        });

        this.setup();

    };

    Game.prototype = {
        width: 1600,
        height: 1200,
        taptimeframe: 10,
        playview: null,

        setup : function(){
            console.log('setting up game');
            for (i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];
                switch (gameobject.type) {
                    case 'Tap':
                        //console.log("TapObject detected");
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
            return this.playview.getTimeDelta.bind(this.playview)();
        },

        update: function () {
            if (this.getTime() + this.starttime >= this.endtime) {
                this.endGame();
            }

            for (var i = 0; i < this.gameobjects.length; i++) {
                this.gameobjects[i].update(this.getTime());
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

        start : function(){
            this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
            this.updateView(this.getTime());
        },

        stop : function(){
            clearInterval(this.updateinterval);
        },

        calculateHighScore: function () {
            //var highscores = [];
            var highscoresum = 0;

            for (var i = 0; i < this.gameobjects.length; i++) {
                //highscores.push(this.gameobjects[i].getHighScore());
                highscoresum += this.gameobjects[i].getHighScore();
            }

            var highscoreaverage = highscoresum / this.gameobjects.length;
            var highscore = (highscoreaverage * 100).toFixed(1) + '%';

            return highscore;
        }

    };

    return Game;
});