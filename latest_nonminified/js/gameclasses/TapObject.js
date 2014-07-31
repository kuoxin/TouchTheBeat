define([
    'jquery',
    'underscore',
    'backbone',
    'snap',
    'util/analytics'
], function ($, _, Backbone, Snap, analytics) {

    var TapObject = function (game, timestamp, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.timestamp = timestamp;
    };

    TapObject.prototype = {

        //relatve timing preferences
        startborder: -0.5,
        endborder: 0,
        radius: 120,
        borderradius: 20,
        removeuntil: 0.5,
        removefrom: 0.4,
        startshow: -0.8,
        endshow: 0,

        //visual preferences
        visual_type: 'circle',
        color_plain_fill: '#FFFFFF',
        color_plain_border: '#EEEEEE',
        color_tapped_fill: '#33CC33',
        color_tapped_border: '#FFFF66',
        color_missed_fill: '#CC0000',
        color_missed_border: '#CC0000',

        //objects needed during loop
        tapdelta: NaN,
        snapobject: null,
        renderloop_enabled: true,
        logic_enabled: true,
        time_render: NaN,
        time_logic: NaN,
        tapped: false,

        //objects for calculating highscore
        tapdiff: NaN,
        max_tapdiff: 0.2,

        //debug
        debugtime: NaN,


        setSnapAttr: function (attr) {
            if (this.snapobject == null) {
                this.createVisualElement();
            }
            if (this.snapobject != null) {
                this.snapobject.attr(attr);
            }
        },


        createVisualElement: function () {

            switch (this.visual_type) {
                case 'circle':
                    this.snapobject = this.game.surface.getSnap().circle(this.x, this.y, this.radius);
                    break;
                default:
                    console.error('unknown tapobject type: ' + this.visual_type);
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
            // if (this.timestamp == this.debugtime)
            this.setSnapAttr({
                fill: this.color_missed_fill
            });

            this.logic_enabled = false;

            if (this.time_logic < this.max_tapdiff) {
                console.log('TapObject was missed (too early) at ' + Math.abs(Math.floor(this.time_logic * 100)));
                analytics.trackAction('game', 'TapObject', 'missed (too early)', Math.abs(Math.abs(Math.floor(this.time_logic * 100))));
            }

            var diff = Math.abs(Math.floor(this.tapdiff * 1000));

        },


        markHit: function () {
            // create the object if it is not already there, which might happen when the user has the game minimized...

            if (this.timestamp == this.debugtime)
                console.log('hit');

            this.setSnapAttr({
                fill: this.color_tapped_fill
            });
            this.tapdiff = this.time_logic;
            this.logic_enabled = false;

            analytics.trackAction('game', 'TapObject', 'hit (too ' + ((this.tapdiff < 0) ? 'early' : 'late') + ')', Math.abs(Math.floor(this.tapdiff * 100)));
            console.log('TapObject was hit too ' + ((this.tapdiff < 0) ? 'early' : 'late') + ' at ' + Math.abs(Math.floor(this.tapdiff * 100)));

        },

        handleTap: function () {
            if (this.timestamp == this.debugtime)
                console.info('allowed tap: ' + this.logic_enabled);
            if (!this.tapped) {
                this.tapped = true;

                if (this.logic_enabled) {
                    if (Math.abs(this.getTimeDiff()) <= this.max_tapdiff) {
                        this.markHit();
                    }
                    else {
                        this.markMissed();
                    }
                }
                else {
                    console.log('TapObject was missed (too late) at ' + Math.abs(Math.floor(this.time_logic * 100)));
                    analytics.trackAction('game', 'TapObject', 'missed (too late)', Math.abs(Math.floor(this.time_logic * 100)));
                }

            }

        },

        markUpcoming: function (percentage) {
            if (this.timestamp == this.debugtime)
                console.log('mark upcoming at ' + this.time_render + ' with ' + percentage + '%');
            this.setSnapAttr({
                strokeWidth: this.borderradius * percentage
            });
        },

        setOpacity: function (percentage) {
            this.setSnapAttr({
                "opacity": percentage
            });
        },

        update: function () {

            if (this.logic_enabled) {
                this.time_logic = this.getTimeDiff();

                if (this.timestamp == this.debugtime)
                    console.log('logic update at ' + this.time_logic);

                if (this.time_logic >= this.max_tapdiff) {
                    this.markMissed();
                }
            }

        },

        render: function () {
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

                    if (this.snapobject != null)
                        this.snapobject.remove();

                    if (!this.tapped) {
                        analytics.trackAction('game', 'TapObject', 'was not tapped');
                    }

                    if (this.timestamp == this.debugtime)
                        console.log('removed from dom: ' + this.timestamp + ' at ' + this.time_render + ' (' + (this.time_render - this.removeuntil) + ')');
                }

            }
        },

        getTimeDiff: function () {
            return this.game.getTime() - this.timestamp;
        },

        getPercentage: function (min, max) {
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