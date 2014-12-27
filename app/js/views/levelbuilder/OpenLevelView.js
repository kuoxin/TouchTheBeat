define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/openlevel.html',
    'views/LevelTextInputView',
    'app'
], function ($, _, Framework, plainTemplate, LevelTextInputView, app) {
    var OpenLevelView = Framework.View.extend({

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
            levelbuilderview.getContent('leveleditor').setModel(level);
            levelbuilderview.setContent('leveleditor');
        }


    });

    return OpenLevelView;
});