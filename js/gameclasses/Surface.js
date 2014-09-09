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

        setProgress: function (progress) {
            this.loadingindicator.attr({
                width: (this.loadingindicatorwidth * progress)
            });
        },

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
        /*

         // This animation is not rendering fluently on the testing device

         animateStartAction: function(time){

         if (this.startaction && this.isstartactionvisible ){
         this.startaction.attr({
         opacity: 0.33*Math.sin(time/500) + 0.66
         });

         requestAnimationFrame(this.animateStartAction.bind(this));
         }
         },
         */

    };

    return Surface;
});