/**
 * This module extends the Backbone Framework by multiple features needed in TouchTheBeat.
 * @module framework
 * @class Framework
 */
define([
	'underscore',
	'backbone',
	'framework/Controller',
	'framework/Model',
	'framework/View',
	'framework/GameObject',
	'framework/Renderer',
	'framework/Backend',
	'framework/CollectionView',
	'lib/backbone.paginator',
	'lib/backbone.select'
], function (_, Backbone, Controller, Model, View, GameObject, Renderer, Backend, CollectionView, PageableCollection) {

	var Framework = {};
	/**
	 * @property {Model} Model
	 */
	Framework.Model = Model;

	/**
	 * @property {View} View
	 */
	Framework.View = View;

	/**
	 * @property {Collection} Collection
	 */
	Framework.Collection = Backbone.Collection;

	/**
	 * @property {Controller} Controller
	 */
	Framework.Controller = Controller;

	/**
	 * @property {GameObject} GameObject
	 */
	Framework.GameObject = GameObject;

	/**
	 * @property {Renderer} Renderer
	 */
	Framework.Renderer = Renderer;

	/**
	 * @property {CollectionView} CollectionView
	 */
	Framework.CollectionView = CollectionView;

	/**
	 * the third party object of backbone.select
	 * @property {Object} Select
	 * @type {Backbone.Select|*}
	 */
	Framework.Select = Backbone.Select;

	/**
	 * @property {PageableCollection} PageableCollection
	 */
	Framework.PageableCollection = PageableCollection;

	/**
	 * @property {API} API
	 */
	Framework.Backend = Backend;

	/**
	 * @property {Backbone.history} history
	 */
	Framework.history = Backbone.history;

	/**
	 * @method sync {Backbone.sync}
	 */
	Framework.sync = Backbone.sync;

	return Framework;
});
