define([
	'jquery',
	'underscore',
	'Framework',
	'game/ShapeFactory',
], function ($, _, Framework, ShapeFactory) {
	"use strict";
	var TapObjectRenderer = Framework.Renderer.extend({

		//relatve timing preferences
		startborder: -0.3,
		endborder: 0,
		removeuntil: 0.6,
		removefrom: 0.4,
		startshow: -0.8,
		endshow: 0,
		hitAnimationDuration: 0.15,

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
			this.dimensions = {
				total: ShapeFactory.sizes[this.options.shape.size]
			};
			this.dimensions.border = this.dimensions.total / 8;
			this.dimensions.shape = this.dimensions.total - this.dimensions.border;

			this.hitAnimation = {
				active: false
			};
			this.upcomingAnimation = {
				active: true
			};
			this.fadeInAnimation = {
				active: true
			};
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
			this.stopUpcomingAnimation();
			this.fadeInAnimation.active = false;
			this.crossmark = this.snap.path("M0 0L10 10M10 0L0 10").attr({
				stroke: "#888888",
				strokeWidth: 3

				// transform to shape dependent point and increase the size
			}).transform("t" + (this.snapobject.markerPoint.x - 5) + "," + (this.snapobject.markerPoint.y - 5) + "s2");

			this.g.add(this.crossmark);
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
				size: this.dimensions.shape
			});
			this.g = this.snap.g(this.snapobject);

			// for debuging
			//var coords = this.snapobject.getBBox();
			//this.rect = this.g.rect(coords.x, coords.y, coords.width, coords.height)
			//	.attr({fill: "none", stroke: "#aaaaaa", "stroke-width": 1});

			this.options.gameObjectGroup.add(this.g);

			this.snapobject.attr({
				fill: this.color_plain_fill,
				stroke: this.color_plain_border,
				strokeWidth: this.dimensions.border,
				opacity: 0
			});

			this.snapobject.touchend(this.actions.TAP);
			this.snapobject.click(this.actions.TAP);
		},

		stopUpcomingAnimation: function () {
			this.upcomingAnimation.active = false;
			this.setSnapAttr({
				strokeWidth: 0
			});
		},

		markHit: function () {
			this.stopUpcomingAnimation();
			this.fadeInAnimation.active = false;
			this.setOpacity(1);
			this.hitAnimation.active = true;
		},

		renderHitAnimation: function () {
			if (!this.hitAnimation.started) {
				_.extend(this.hitAnimation, {
					started: true,
					startTime: this.time,
					endTime: this.time + this.hitAnimationDuration,
					originalRadius: parseFloat(this.snapobject.attr("r")),
					id: _.uniqueId('animation')
				});
			}
			if (this.time >= this.hitAnimation.endTime) {
				this.hitAnimation.active = false;
				this.snapobject.transform("s" + this.getHitAnimationScale(1));
				return;
			}
			var animationPosition = this.getPercentage(this.hitAnimation.startTime, this.hitAnimation.endTime);
			this.snapobject.transform("s" + this.getHitAnimationScale(animationPosition));
		},

		getHitAnimationScale: function (x) {
			var standardWidth = ShapeFactory.sizes[this.options.shape.size];
			var targetWidth = standardWidth + this.dimensions.border * (1 + (-1 * Math.pow(1.66 * x - 1, 2)));
			return targetWidth / standardWidth;
		},

		renderUpcomingAnimation: function () {
			//animating border between startborder and endborder
			if (this.time < this.endborder) {
				this.setSnapAttr({
					strokeWidth: this.dimensions.border * (1 - this.getPercentage(this.startborder, this.endborder))
				});
			}
			else {
				this.stopUpcomingAnimation();
			}
		},

		renderFadeInAnimation: function () {
			//fading in between startshow and endshow
			if (this.time >= this.startshow && this.time < this.endshow) {
				if (this.snapobject === 'undefined') {
					this.createVisualElement();
				}
				var opacity = this.getPercentage(this.startshow, this.endshow) - 0.2;
				if (opacity < 0) {
					opacity = 0;
				}
				this.setOpacity(opacity);
			}
			else {
				this.fadeInAnimation.active = false;
			}
		},

		setOpacity: function (percentage) {
			this.setSnapAttr({
				"opacity": percentage
			});
		},

		getPercentage: function (start, end) {
			return (this.time - start) / (end - start);
		},


		render: function (time) {
			this.time = time = time - this.options.timestamp;

			if (time >= this.startborder) {
				this.upcomingAnimation.active = true;
			}

			if (this.upcomingAnimation.active) {
				this.renderUpcomingAnimation();
			}

			if (this.fadeInAnimation.active) {
				this.renderFadeInAnimation();
			}

			if (this.hitAnimation.active) {
				this.renderHitAnimation();
			}

			//fading out between removefrom and removeuntil
			if (time >= this.removefrom && time < this.removeuntil) {
				this.setOpacity(1 - this.getPercentage(this.removefrom, this.removeuntil));
			}

			//remove objects after removeuntil
			if (time >= this.removeuntil) {
				if (typeof this.snapobject !== 'undefined') {
					this.snapobject.remove();
				}

				if (typeof this.crossmark !== 'undefined') {
					this.crossmark.remove();
				}

				if (typeof this.g !== 'undefined') {
					this.g.remove();
				}

				return false;
			}
			return true;
		}


	});
	return TapObjectRenderer;
});
