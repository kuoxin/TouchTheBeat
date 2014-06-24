define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {

    var Surface = function (playview) {
        this.playview = playview;
        this.snap = new Snap('#svg');
        var r = this.snap.rect(0, 0, "100%", "100%", 0);

        r.attr({
            fill: '#6699FF'
        });

        r.touchend(function () {
            console.log("touchend");
        });
    };

    Surface.prototype = {
        width: 1600,
        height: 1200,
        taptimeframe: 10,
        playview: null,

        getRandomInteger: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getTime: function () {
            return this.playview.getTimeDelta();
        }
    };

    return Surface;
})
;