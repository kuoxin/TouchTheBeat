define([
	'jquery',
	'underscore',
	'Framework'
], function ($, _, Framework) {
	"use strict";
	var HUDRenderer = Framework.Renderer.extend({

		// google material design ic_pause_48px.svg
		pauseButtonPath: "M12 38h8V10h-8v28zm16-28v28h8V10h-8z",


		initialize: function (options) {
			this.options = options;
			this.rendered = false;
		},

		firstRender: function () {
			this.pause = this.snap.path(this.pauseButtonPath);
			this.pause.attr({
				fill: '#ffffff'
			});
			this.pause.touchstart(this.actions.PAUSE);
			this.pause.click(this.actions.PAUSE);

			this.rendered = true;
		},

		render: function (time) {
			if (!this.rendered) {
				this.firstRender();
			}
			return true;
		},

		getStartTime: function () {
			// the game's HUD will be rendered from the beginning until the end.
			return 0;
		}
	});
	return HUDRenderer;
});