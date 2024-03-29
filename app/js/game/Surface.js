define([
    'jquery',
    'underscore',
    'snap'
], function ($, _, Snap) {

    var Surface = function (options) {
        this.options = options;
        this.snap = new Snap(options.el || '#surfaceSVG');
        this.r = this.snap.rect(0, 0, "100%", "100%", 0);
        this.r.attr({
            fill: this.options.bgcolor || '#000000'
        });
    };


    Surface.prototype = {
        width: 1600,
        height: 1200,

        getSnap: function () {
            return this.snap;
        },

        getRootRect: function () {
            return this.r;
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

            //this.isstartactionvisible = true;
            //requestAnimationFrame(this.animateStartAction.bind(this));
            var continue_function = function () {
                this.getRootRect().unclick();
                this.startaction.unclick();
                //this.isstartactionvisible = false;
                startaction.remove();
                callback();
            }.bind(this);


            this.getRootRect().click(continue_function);
            this.startaction.click(continue_function);
        }


    };

    return Surface;
});
