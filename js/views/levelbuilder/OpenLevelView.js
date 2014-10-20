define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/openlevel.html',
    'views/components/html/LevelTextInputView',
    'app'
], function ($, _, Backbone, plainTemplate, LevelTextInputView, app) {
    var OpenLevelView = Backbone.View.extend({

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
            console.log(level);
            app.models.levelEditorModel = level;
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent('leveleditor');
        }


    });

    return OpenLevelView;
});