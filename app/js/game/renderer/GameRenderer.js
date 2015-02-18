define([
	'jquery',
	'underscore',
	'Framework',
	'snap'
], function ($, _, Framework, Snap) {
	"use strict";
	var GameRenderer = Framework.Renderer.extend({


		initialize: function (options) {
			this.options = options;
			this.controller.assets = {};
			this.controller.assets.filters = {};
			this.rendered = false;
			this.listenTo(this.controller, 'pause', this.onPause);
			this.listenTo(this.controller, 'resume', this.onResume);
		},

		onPause: function () {
			this.controller.gameObjectGroup.attr({
					filter: this.controller.assets.filters.blur
				}
			);
		},

		onResume: function () {
			this.controller.gameObjectGroup.attr({
					filter: null
				}
			);
		},

		firstRender: function () {
			this.controller.assets.filters.blur = this.snap.filter(Snap.filter.blur(5, 10));
			this.rendered = true;
		},

		render: function () {
			if (!this.rendered) {
				this.firstRender();
			}
			else {
				this.controller.hud.render(this.controller.getTime());
				for (var i = 0; i < this.controller.gameObjects.length; i++) {
					this.controller.gameObjects[i].render(this.controller.getTime());
				}
			}
			return true;
		},

		getStartTime: function () {
			// the game will be rendered from the beginning until the end.
			return 0;
		}
	});
	return GameRenderer;
});
