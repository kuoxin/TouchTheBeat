define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {

    var TapObject = function (surface, timestamp, x, y) {
        this.surface = surface;
        this.x = x;
        this.y = y;
        this.timestamp = timestamp;
    };

    TapObject.prototype = {

        //relatve timing preferences
        startborder: -1,
        endborder: 0,
        accepttapfrom: -0.200,
        accepttapto: 0.200,
        radius: 100,
        borderradius: 20,
        removeuntil: 1.5,
        removefrom: 0.0000000001,
        startshow: -1.5,
        endshow: -0.00000000001,

        //visual preferences
        visual_type: 'circle',
        color_plain_fill: '#FFFFFF',
        color_plain_border: '#EEEEEE',
        color_tapped_fill: '#bada55',
        color_tapped_border: '#bada55',
        color_missed_fill: '#DDDDDD',
        color_missed_border: '#DDDDDD',

        //objects needed during loop
        tapdelta: NaN,
        timediff: NaN,
        snapobject: null,
        renderloop_enabled: true,
        logic_enabled: true,

        //debug
        debugtime : 7.116905,

        createVisualElement: function(){

            switch(this.visual_type){
                case 'circle':
                    this.snapobject = this.surface.snap.circle(this.x, this.y, this.radius);
                    break;
                default:
                    console.error('unknown tapobject type: '+this.visual_type);
            }

            this.snapobject.attr({
                fill: this.color_plain_fill,
                stroke: this.color_plain_border,
                strokeWidth: this.borderradius,
                opacity: 0
            });
            this.snapobject.touchend(this.handleTap.bind(this));
            this.snapobject.click(this.handleTap.bind(this));
        },

        markMissed: function () {
            if (this.timestamp == this.debugtime)
                console.log('missed');

            this.snapobject.attr({
                fill: this.color_missed_fill
            });
            this.logic_enabled = false;

        },


        markHit: function () {
            if (this.timestamp == this.debugtime)
                console.log('hit');

            this.snapobject.attr({
                fill: this.color_tapped_fill
            });
            this.tapdelta = this.timediff;
            this.logic_enabled = false;

        },

        handleTap: function () {
            console.info('allowed tap: '+this.logic_enabled);
            if (this.logic_enabled) {

                var timediff = this.surface.getTime() - this.timestamp;
                console.log(timediff);
                if (timediff > this.accepttapfrom && timediff < this.accepttapto) {
                    this.markHit();
                }
                else {
                    this.markMissed();
                }
            }

        },

        markUpcoming: function (percentage) {
            this.snapobject.attr({
                strokeWidth: this.borderradius * percentage
            });
        },

        setOpacity: function(percentage) {
            this.snapobject.attr({
                "opacity": percentage
            });
        },

        update: function (time) {
            if (this.logic_enabled) {
                if (this.timediff >= this.accepttapto) {
                    this.markMissed();
                }
            }
            //remove object after removeuntil
            if (this.timediff >= this.removeuntil) {
                this.logic_enabled = false;
                this.setOpacity(0);
                if (this.timestamp ==this.debugtime)
                    console.log('deactivated at ' + this.timediff + ' (' + (this.timediff - this.removeuntil) + ')');
                this.renderloop_enabled = false;
                this.logic_enabled = false;
                return;
            }

            this.render(time);
        },

        render: function(time){


            if (this.renderloop_enabled) {
                if (this.timestamp == this.debugtime)
                    console.log('renderloop : '+this.renderloop_enabled);

                this.timediff = time - this.timestamp;



                //animating border between startborder and endborder
                if (this.timediff >= this.startborder && this.timediff < this.endborder) {
                    if (this.timestamp == this.debugtime)
                        console.log('upcoming: ' + (1 - this.getPercentage(this.startborder, this.endborder)));

                    this.markUpcoming(1 - this.getPercentage(this.startborder, this.endborder));
                }

                //fading in between startshow and endshow
                if (this.timediff >= this.startshow && this.timediff < this.endshow) {
                    if (this.snapobject == null)
                        this.createVisualElement();
                    if (this.timestamp == this.debugtime)
                        console.log('fading in: ' + this.getPercentage(this.startshow, this.endshow));

                    this.setOpacity(this.getPercentage(this.startshow, this.endshow));
                }

                //fading out between removefrom and removeuntil
                if (this.timediff >= this.removefrom && this.timediff < this.removeuntil) {
                    if (this.timestamp == this.debugtime)
                        console.log('fading out: ' + (1 - this.getPercentage(this.removefrom, this.removeuntil)));
                    this.setOpacity(1 - this.getPercentage(this.removefrom, this.removeuntil));
                }

            }
        },

        getPercentage: function(min, max){
            var percentage = (this.timediff - min) / (max - min);
           // var percentage = this.timediff/max;
            return Math.abs(percentage);
            //return (percentage < 0) ? 0: (percentage > 1) ? 1 : percentage;
        },

        getHighScore: function () {
            if (isNaN(this.tapdelta))
                return 0;
            return 1 - Math.abs(this.tapdelta) / (Math.abs(this.accepttapfrom) + Math.abs(this.accepttapto) / 2);
        }
    };

    return TapObject;
});