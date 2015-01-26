define([
	'jquery',
	'underscore',
	'Framework',
	'game/renderer/HUDRenderer',
	'snap'
], function ($, _, Framework, HUDRenderer, Snap) {
	"use strict";
	var HUD = Framework.GameObject.extend({
		initialize: function (game) {
			this.game = game;
			this.setRenderer(new HUDRenderer({
				controller: this,
				snap: {
					gameProgressBar: new Snap('#gameHudProgressBarSVG'),
					gamePauseButton: new Snap('#gameHudPauseButtonSVG')
				},
				actions: {
					PAUSE: this.onPauseButtonClick.bind(this)
				}
			}));
		},

		getPassedPercentage: function () {
			return this.game.audiocontroller.getPercentage() * 100;
		},

		onPauseButtonClick: function () {
			if (!this.game.stopped) {
				this.game.pause();
			}
		}
	});
	return HUD;
});
