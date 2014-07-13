define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {

    var TapObject = function (game, timestamp, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.timestamp = timestamp;
    };

    TapObject.prototype = {

        //relatve timing preferences
        startborder: -1,
        endborder: 0,
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
        snapobject: null,
        renderloop_enabled: true,
        logic_enabled: true,
        time_render : NaN,
        time_logic : NaN,

        //objects for calculating highscore
        tapdiff: NaN,
        max_tapdiff: 0.2,

        //debug
        debugtime: NaN,

        createVisualElement: function(){

            switch(this.visual_type){
                case 'circle':
                    this.snapobject = this.game.snap.circle(this.x, this.y, this.radius);
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
            this.tapdiff = this.time_logic;
            this.logic_enabled = false;

        },

        handleTap: function () {
            if (this.timestamp == this.debugtime)
                console.info('allowed tap: ' + this.logic_enabled);
            if (this.logic_enabled) {

                if (Math.abs(this.getTimeDiff()) <= this.max_tapdiff) {
                    this.markHit();
                }
                else {
                    this.markMissed();
                }
            }

        },

        markUpcoming: function (percentage) {
            if (this.timestamp == this.debugtime)
                console.log('mark upcoming at '+this.time_render+' with '+percentage + '%');
            this.snapobject.attr({
                strokeWidth: this.borderradius * percentage
            });
        },

        setOpacity: function(percentage) {
            this.snapobject.attr({
                "opacity": percentage
            });
        },

        update: function () {

            if (this.logic_enabled) {
                this.time_logic = this.getTimeDiff();

                if (this.timestamp == this.debugtime)
                    console.log('logic update at '+this.time_logic);

                if (this.time_logic >= this.max_tapdiff) {
                    this.markMissed();
                }
            }

        },

        render: function(){
            if (this.renderloop_enabled) {
                //TODO: MAKE IT SAVE AND FIXED WITH AUDIO PLAY/PAUSE
               this.time_render = this.getTimeDiff();


                //animating border between startborder and endborder
                if (this.time_render >= this.startborder && this.time_render < this.endborder) {
                    if (this.timestamp == this.debugtime)
                        console.log('upcoming: ' + (this.getPercentage(this.startborder, this.endborder)));

                    this.markUpcoming(this.getPercentage(this.startborder, this.endborder));
                }

                //fading in between startshow and endshow
                if (this.time_render >= this.startshow && this.time_render < this.endshow) {
                    if (this.snapobject == null)
                        this.createVisualElement();
                    if (this.timestamp == this.debugtime)
                        console.log('fading in: ' + 1 - this.getPercentage(this.startshow, this.endshow));

                    this.setOpacity(1 - this.getPercentage(this.startshow, this.endshow));
                }

                //fading out between removefrom and removeuntil
                if (this.time_render >= this.removefrom && this.time_render < this.removeuntil) {
                   // if (this.timestamp == this.debugtime)
                    //    console.log('fading out: ' + (1 - this.getPercentage(this.removefrom, this.removeuntil)));
                    this.setOpacity(1 - this.getPercentage(this.removefrom, this.removeuntil));
                }

                //remove object after removeuntil
                if (this.time_render >= this.removeuntil) {
                    this.renderloop_enabled = false;
                    this.snapobject.remove();
                    if (this.timestamp == this.debugtime)
                        console.log('removed from dom: ' + this.timestamp + ' at ' + this.time_render + ' (' + (this.time_render - this.removeuntil) + ')');
                }

            }
        },

        getTimeDiff : function(){
            return this.game.getTime() - this.timestamp;
        },

        getPercentage: function(min, max){
            var percentage = this.time_render / (max - min);
           // var percentage = this.timediff/max;
            return Math.abs(percentage);
            //return (percentage < 0) ? 0: (percentage > 1) ? 1 : percentage;
        },
        /**
         *
         * @returns a floating point number between 0 and 1 describing the accuracy of the users interaction (0 = no interaction, best == 1)
         */
        getHighScore: function () {
            if (isNaN(this.tapdiff))
                return 0;

            // add a bonus for actually hitting the TapObject in time
            var diff = Math.abs(this.tapdiff) - 0.05;

            if (diff <= 0)
                return 1;
            else
                return 1 - (diff / this.max_tapdiff);
        }

    };

    return TapObject;
});