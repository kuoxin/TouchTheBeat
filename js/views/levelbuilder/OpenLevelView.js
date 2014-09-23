define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/openlevel.html',
    'views/components/html/LevelTextInputView',
    'app',
    'models/Level'
], function ($, _, Backbone, plainTemplate, LevelTextInputView, app, Level) {
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
            app.models.levelEditorModel = new Level(level);
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent(levelbuilderview.contents.gameobjecteditorview);

        }


    });

    return OpenLevelView;
});