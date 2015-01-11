define([
	'jquery',
	'underscore',
	'Framework',
	'game/renderer/HUDRenderer'
], function ($, _, Framework, HUDRenderer) {
	"use strict";
	var HUD = Framework.GameObject.extend({
		initialize: function (game) {
			this.game = game;
			this.setRenderer(new HUDRenderer({
				controller: this,
				snap: game.surface.getSnap(),
				actions: {
					PAUSE: this.onPause.bind(this)
				}
			}));
		},

		onPause: function () {
			console.log('triggering pause, game was stopped: ' + this.game.stopped);
			if (!this.game.stopped) {
				this.game.pause();
			}
			else {
				this.game.resume();
			}
		}
	});
	return HUD;
});
