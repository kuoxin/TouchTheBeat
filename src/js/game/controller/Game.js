define([
    'jquery',
    'underscore',
    'Framework',
    'game/controller/TapObject'
], function ($, _, Framework, TapObject) {
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
            var level = data.level.toJSON();

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
        },

        getTime: function () {
            return this.audiocontroller.getCurrentTime();
        },

        update: function () {
            if (!this.stopped) {
                //update gameobjects

                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].update(this.getTime());
                }
            }
        },

        updateView: function () {
            if (!this.stopped) {
                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].render(this.getTime());
                }
                requestAnimationFrame(this.updateView.bind(this));
            }
        },

        start: function () {
            this.stopped = false;
            console.log('startet game');
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


    });

    return Game;
});