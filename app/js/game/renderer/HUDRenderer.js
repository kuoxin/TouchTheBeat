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

			this.listenTo(this.controller.game, 'pause', this.onPause);
			this.listenTo(this.controller.game, 'resume', this.onResume);
		},

		firstRender: function () {
			this.firstRenderProgressBar();
			this.firstRenderPauseButton();

			this.rendered = true;
		},

		firstRenderProgressBar: function () {
			this.gameProgressBarBackground = this.snap.gameProgressBar.rect(0, 0, '100%', '100%');
			this.gameProgressBarBackground.attr({
				fill: '#333333'
			});
			this.gameProgressBarForeground = this.snap.gameProgressBar.rect(0, 0, '0%', '100%');
			this.gameProgressBarForeground.attr({
				fill: '#ffffff'
			});
		},

		firstRenderPauseButton: function () {
			this.buttonCircle = this.snap.gamePauseButton.circle(0, 0, '65');
			this.buttonCircle.attr({
				fill: '#333333'
			});

			this.pauseSymbol = this.snap.gamePauseButton.path(this.pauseButtonPath);
			this.pauseSymbol.attr({
				fill: '#ffffff',
				x: 32.5,
				y: 0
			});

			this.pause = this.snap.gamePauseButton.group(this.buttonCircle, this.pauseSymbol);

			this.pause.attr({
				style: 'overflow:hidden;'
			});

			var callback = this.actions.PAUSE;

			function handleInput(e) {
				// to prevent touch and mouse events firing both
				e.preventDefault();

				callback();
			}

			this.pause.touchstart(handleInput);
			this.pause.click(handleInput);
		},

		onPause: function () {
			this.pause.attr({
					visibility: "hidden"
				}
			);
		},

		onResume: function () {
			this.pause.attr({
					visibility: null
				}
			);
		},

		render: function () {
			if (!this.rendered) {
				this.firstRender();
			}
			else {
				this.gameProgressBarForeground.attr({
					width: this.controller.getPassedPercentage() + '%'
				});
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
