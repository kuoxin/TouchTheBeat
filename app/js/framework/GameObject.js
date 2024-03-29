define(['jquery', 'underscore', 'backbone', 'framework/Controller'], function ($, _, Backbone, Controller) {
	/**
	 * A GameObject controls the logic of an element in the game.
	 * @class GameObject
	 * @extends Controller
	 */
	var GameObject = Controller;

	_.extend(GameObject.prototype, {
		getRenderer: function () {
			"use strict";
			return this.renderer.component;
		},
		setRenderer: function (renderer) {
			"use strict";
			this.renderer = {
				component: renderer,
				starttime: renderer.getStartTime()
			};
		},
		/**
		 * triggers the renderers render method when currenttime > time
		 *
		 * @param time
		 * @returns {boolean} true, if the renderer method wishes to be called again
		 */
		render: function (time) {
			"use strict";
			if (!this.active) {
				this.active = (time >= this.renderer.starttime);
			}
			if (this.active) {
				this.active = this.renderer.component.render(time);
				return this.active;
			}
			return true;
		}
	});

	return GameObject;
});
