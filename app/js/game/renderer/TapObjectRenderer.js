define([
	'jquery',
	'underscore',
	'Framework',
	'game/ShapeFactory'
], function ($, _, Framework, ShapeFactory) {
	"use strict";
	var TapObjectRenderer = Framework.Renderer.extend({

		//relatve timing preferences
		startborder: -0.5,
		endborder: 0,
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

		initialize: function (options) {
			this.options = options;
		},

		setSnapAttr: function (attr) {
			// create the object if it is not already there (might happen when the user had the game minimized...)
			if (typeof this.snapobject === 'undefined') {
				this.createVisualElement();
			}
			if (typeof this.snapobject !== 'undefined') {
				this.snapobject.attr(attr);
			}
		},

		markMissed: function () {
			this.setSnapAttr({
				fill: this.color_missed_fill
			});
		},

		getStartTime: function () {
			return this.startshow + this.options.timestamp;
		},

		createVisualElement: function () {

			// uncomment this for a quick demo of the ShapeFactory
			//this.snapobject = ShapeFactory.createShape(this.game.surface.getSnap(), scripts.pickRandomObject(ShapeFactory.shapes), {x: this.x, y: this.y, size: "medium"});

			this.snapobject = ShapeFactory.createShape(this.snap, this.options.shape.type, {
				x: this.options.x,
				y: this.options.y,
				size: this.options.shape.size
			});

			this.snapobject.attr({
				fill: this.color_plain_fill,
				stroke: this.color_plain_border,
				strokeWidth: this.borderradius,
				opacity: 0
			});

			this.snapobject.touchend(this.actions.TAP);
			this.snapobject.click(this.actions.TAP);
		},


		markHit: function () {
			this.setSnapAttr({
				fill: this.color_tapped_fill
			});
		},

		markUpcoming: function (percentage) {
			this.setSnapAttr({
				strokeWidth: this.borderradius * percentage
			});
		},

		setOpacity: function (percentage) {
			this.setSnapAttr({
				"opacity": percentage
			});
		},

		getPercentage: function (min, max) {
			var percentage = this.time / (max - min);
			// var percentage = this.timediff/max;
			return Math.abs(percentage);
			//return (percentage < 0) ? 0: (percentage > 1) ? 1 : percentage;
		},


		render: function (time) {
			//TODO: check if the render loop gets terminated always when the game stops

			this.time = time = time - this.options.timestamp;

			//animating border between startborder and endborder
			if (time >= this.startborder && time < this.endborder) {
				this.markUpcoming(this.getPercentage(this.startborder, this.endborder));
			}

			//fading in between startshow and endshow
			if (time >= this.startshow && time < this.endshow) {
				if (this.snapobject === 'undefined')
					this.createVisualElement();

				this.setOpacity(1 - this.getPercentage(this.startshow, this.endshow));
			}

			//fading out between removefrom and removeuntil
			if (time >= this.removefrom && time < this.removeuntil) {
				this.setOpacity(1 - this.getPercentage(this.removefrom, this.removeuntil));
			}

			//remove object after removeuntil
			if (time >= this.removeuntil) {
				if (typeof this.snapobject !== 'undefined')
					this.snapobject.remove();
				return false;
			}
			return true;
		}
	});
	return TapObjectRenderer;
});