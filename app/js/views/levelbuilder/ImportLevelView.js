define([
	'jquery',
	'underscore',
	'Framework',
	'text!templates/levelbuilder/importlevel.html',
	'views/LevelTextInputView',
	'app'
], function ($, _, Framework, plainTemplate, LevelTextInputView, app) {

	return Framework.View.extend({

		template: _.template(plainTemplate, {}),

		initialize: function () {
			this.leveltextinputview = new LevelTextInputView(this.levelselected.bind(this));
		},

		render: function () {
			this.$el.html(this.template);
			this.leveltextinputview.setElement(this.$('.leveltextinput'));
			this.leveltextinputview.render();
		},

		levelselected: function (level) {
			var levelbuilderview = app.getMainView().views.levelbuilderview;
			level.set('owner', app.session.get('user'));
			level.unset('id');
			console.log(level);
			levelbuilderview.getContent('leveleditor').setModel(level);

			levelbuilderview.setContent('leveleditor');
		}


	});
});