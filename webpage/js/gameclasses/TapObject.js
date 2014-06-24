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
        tapdelta: NaN,
        startborder: -1,
        accepttapfrom: -0.200,
        accepttapto: 0.200,
        isActive: true,
        radius: 100,
        borderradius: 20,
        removeuntil: 1.5,
        removefrom: 0.0000000001,
        startshow: -1.5,
        endshow: -0.00000000001,
        snapobject: null,

        createVisualElement: function(){
            this.snapobject = this.surface.snap.circle(this.x, this.y, this.radius)
            this.snapobject.attr({
                fill: "#EEEEEE",
                stroke: "#ffffff",
                strokeWidth: this.borderradius,
                opacity: 0
            });
            this.snapobject.touchend(this.handleKeyPress.bind(this));
            this.snapobject.click(this.handleKeyPress.bind(this));
        },

        markMissed: function () {
            if (this.timestamp == 3.758072)
                console.log('missed');

            this.snapobject.attr({
                fill: "#990000"
            });

        },


        markHit: function (time) {
            if (this.timestamp == 3.758072)
                console.log('hit');

            this.snapobject.attr({
                fill: "#bada55"
            });

            this.tapdelta = time;

        },

        handleKeyPress: function () {
            console.log('action');
            if (this.isActive) {
                var timediff = this.surface.getTime() - this.timestamp;
                console.log(timediff);
                if (timediff > this.accepttapfrom && timediff < this.accepttapto) {
                    this.markHit(timediff);
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
            if (this.timestamp == 3.758072)
                console.log('opacity: '+percentage);

            this.snapobject.attr({
                "opacity": percentage
            });
        },

        update: function (time) {
            if (this.isActive) {
                if (this.timestamp == 3.758072)
                    console.log('active loop');
                var timediff = time - this.timestamp;

                if (timediff >= this.removeuntil) {
                    this.isActive = false;
                    this.setOpacity(0);
                    if (this.timestamp == 3.758072)
                        console.log('deactivated at '+timediff+ ' ('+(timediff - this.removeuntil)+')');

                    return;
                }

                if (timediff >= this.accepttapto) {
                    this.markMissed();
                }

                if (timediff < 0){
                    // only called before the desired tap

                    // could/should be called in a seperate render loop
                    if (timediff >= this.startborder) {
                        this.markUpcoming(this.getPercentage(this.startborder, 0));
                    }

                    if (timediff >= this.startshow){
                        if (this.snapobject == null)
                            this.createVisualElement();
                        this.setOpacity(this.getPercentage(this.startshow, this.endshow));
                    }

                }
                else{
                    //only called after the desired tap

                    if (timediff >= this.removefrom){
                        this.setOpacity(1-this.getPercentage(this.removefrom, this.removeuntil));
                    }
                }
            }
        },

        getPercentage: function(value, max){
            var percentage = (this.timestamp+value)/(this.timestamp+max);
            return (percentage < 0) ? 0: (percentage > 1) ? 1 : percentage;
        },

        getHighScore: function () {
            if (isNaN(this.tapdelta))
                return 0;
            return 1 - Math.abs(this.tapdelta) / (Math.abs(this.accepttapfrom) + Math.abs(this.accepttapto) / 2);
        }
    };

    return TapObject;
});