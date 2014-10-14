define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/base.html',
    'views/levelbuilder/GameObjectRecorderView',
    'views/levelbuilder/StartView',
    'views/levelbuilder/OpenLevelView',
    'views/levelbuilder/LevelEditorView'
], function ($, _, Backbone, app, plainTemplate, GameObjectRecorderView, StartView, OpenLevelView, LevelEditorView) {
    var BaseView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        contents: {
            startview: new StartView(),
            gameobjectrecorderview: new GameObjectRecorderView(),
            openlevelview: new OpenLevelView(),
            leveleditorview: new LevelEditorView()
        },

        render: function () {
            if (app.models.levelEditorModel)
                this.setContent('leveleditor');
            else
                this.setContent('start');

        },

        setContent: function (view, args) {
            this.$el.html(this.template);

            if (this.currentContent != null) {
                if (this.currentContent.onClose)
                    this.currentContent.onClose();

                this.currentContent.dispose();
            }

            this.currentContent = this.contents[view + 'view'];
            this.currentContent.setElement(this.$('.content').first());
            this.currentContent.render.apply(this.currentContent, args);
        },

        onClose: function () {
            if (this.currentContent && this.currentContent.onClose)
                this.currentContent.onClose();
        }
    });

    return BaseView;
});
