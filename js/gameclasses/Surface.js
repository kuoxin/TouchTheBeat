define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {

    var Surface = function (options) {
        this.options = options;
        this.snap = new Snap('#svg');
        this.r = this.snap.rect(0, 0, "100%", "100%", 0);
        this.r.attr({
            fill: (this.options['bgcolor'] ? this.options['bgcolor'] : '#000000')
        });

    };


    Surface.prototype = {
        width: 1600,
        height: 1200,

        showLoadingIndicator: function () {
            this.loadingindicator = this.snap.text(this.width / 2, this.height / 2, "Loading...");

            this.loadingindicator.attr({
                fill: "#FFFFFF",
                "font-size": "5em",
                textAnchor: 'middle',
                filter: this.snap.filter(Snap.filter.shadow(0, 2, 3))
            });
        },

        getSnap: function () {
            return this.snap;
        },

        getRootRect: function () {
            return this.r;
        },

        hideLoadingIndicator: function () {
            console.log('hiding loading indicator');
            if (this.loadingindicator)
                this.loadingindicator.remove();
        },

        requestStartFromUser: function (callback) {
            var startaction = this.snap.text(this.width / 2, this.height / 2, "Tap here to start!");

            startaction.attr({
                fill: "#FFFFFF",
                "font-size": "5em",
                textAnchor: 'middle',
                filter: this.snap.filter(Snap.filter.shadow(0, 2, 3)),
                id: 'startactionbutton'
            });

            this.startaction = startaction;

            $('#startactionbutton').click(function () {
                startaction.untouchend();
                startaction.remove();
                callback();
            });
        }

    };

    return Surface;
});