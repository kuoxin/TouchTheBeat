define([
    'jquery',
    'underscore',
    'Framework',
    'snap',
    'util/analytics',
    "game/ShapeFactory",
    'game/renderer/TapObjectRenderer',
    "util/scripts"
], function ($, _, Framework, Snap, analytics, ShapeFactory, TapObjectRenderer) {

    var TapObject = Framework.GameObject.extend({

        initialize: function (game, timestamp, x, y, shape) {
            this.game = game;
			this.listenTo(this.game, 'pause', this.gamePaused);
			this.listenTo(this.game, 'resume', this.gameResumed);
            this.timestamp = timestamp;
			this.actions = {
				TAP: this.handleTap.bind(this)
			};

            this.setRenderer(new TapObjectRenderer({
                snap: game.surface.getSnap(),
				gameObjectGroup: game.gameObjectGroup,
                controller: this,
				actions: this.actions,
                x: x,
                y: y,
                timestamp: timestamp,
                shape: shape
            }));
        },


        tapdelta: NaN,
        logic_enabled: true,
        time_render: NaN,
        time_logic: NaN,
        tapped: false,
		tappingEnabled: true,

        //objects for calculating highscore
        tapdiff: NaN,
        max_tapdiff: 0.2,

        //debug
        debugtime: NaN,

		gameResumed: function () {
			this.tappingEnabled = true;
		},

		gamePaused: function () {
			this.tappingEnabled = false;
		},

        handleTap: function () {

			if (!this.tapped && this.tappingEnabled) {
                this.tapped = true;

                if (this.logic_enabled) {
                    if (Math.abs(this.getTimeDiff()) <= this.max_tapdiff) {
                        // was hit in time
                        this.markHit();
                    }
                    else {
                        // was hit out of time
                        this.markMissed();
                    }
                }
                else {
                    console.log('TapObject was missed (too late) at ' + Math.abs(Math.floor(this.time_logic * 100)));
                    analytics.trackAction('game', 'TapObject', 'missed (too late)', Math.abs(Math.floor(this.time_logic * 100)));
                }

            }

        },

        markHit: function () {
            "use strict";
            this.tapdiff = this.time_logic;
            this.logic_enabled = false;

            analytics.trackAction('game', 'TapObject', 'hit (too ' + ((this.tapdiff < 0) ? 'early' : 'late') + ')', Math.abs(Math.floor(this.tapdiff * 100)));
            console.log('TapObject was hit too ' + ((this.tapdiff < 0) ? 'early' : 'late') + ' at ' + Math.abs(Math.floor(this.tapdiff * 100)));

            this.getRenderer().markHit();
        },

        markMissed: function () {
            "use strict";
            this.logic_enabled = false;

            if (this.time_logic < this.max_tapdiff) {
                console.log('TapObject was missed (too early) at ' + Math.abs(Math.floor(this.time_logic * 100)));
                analytics.trackAction('game', 'TapObject', 'missed (too early)', Math.abs(Math.abs(Math.floor(this.time_logic * 100))));
            }
            this.getRenderer().markMissed();
        },

        update: function () {
            if (this.logic_enabled) {
                this.time_logic = this.getTimeDiff();

                if (this.time_logic >= this.max_tapdiff) {
                    this.markMissed();
                }
            }

        },

        getTimeDiff: function () {
            return this.game.getTime() - this.timestamp;
        },


        /**
         *
         * @returns number a floating point number between 0 and 1 describing the accuracy of the users interaction (0 = no interaction, best == 1)
         */
        getHighScore: function () {
			if (isNaN(this.tapdiff)) {
				return 0;
			}

            // add a bonus for actually hitting the TapObject in time
            var diff = Math.abs(this.tapdiff) - 0.05;

			if (diff <= 0) {
				return 1;
			}
			else {
				return 1 - (diff / this.max_tapdiff);
			}

        }

    });

    return TapObject;
});
