define([
	'underscore',
	'jquery',
	'framework/View'
], function (_, $, View) {
	/**
	 * adapted from http://liquidmedia.org/blog/2011/02/backbone-js-part-3
	 */

	var CollectionView = View.extend({
		initialize: function (options) {
			this.childView = options.childView;
			this.collection = options.collection;
			this.getViewParams = options.getViewParams;

			if (!this.childView) {
				throw "no child view class provided";
			}
			if (!this.collection) {
				throw "no collection provided";
			}
			if (!this.getViewParams) {
				throw "no getViewParams method provided";
			}

			this._childViews = [];

			this.collection.each(this.addElement.bind(this));
			this.doListen();
		},

		doListen: function () {
			"use strict";
			this.listenTo(this.collection, 'add', this.addElement);
			this.listenTo(this.collection, 'remove', this.removeElement);
		},

		addElement: function (model) {
			var params = this.getViewParams(model);
			var view = new this.childView(params);

			this._childViews.push(view);

			if (this.rendered) {
				this.$el.append(view.render().el);
			}

		},

		removeElement: function (model) {
			var viewToRemove = _(this._childViews).select(function (cv) {
				return cv.model === model;
			})[0];
			this._childViews = _(this._childViews).without(viewToRemove);

			if (this.rendered) {
				viewToRemove.close();
			}
		},

		render: function () {
			var that = this;

			$(this.el).empty();

			_(this._childViews).each(function (view) {
				$(that.el).append(view.render().el);
			});

			this.rendered = true;


			return this;
		},

		onClose: function () {
			this.rendered = false;
			_(this._childViews).each(function (view) {
				view.close();
			});
		},
		onClosed: function () {
			"use strict";
			// keep listening to the collection to update the views array in the background
			this.doListen();
		}
	});
	return CollectionView;
});