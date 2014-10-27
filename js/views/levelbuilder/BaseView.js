define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/base.html',
    'views/levelbuilder/GameObjectRecorderView',
    'views/levelbuilder/StartView',
    'views/levelbuilder/OpenLevelView',
    'views/levelbuilder/LevelEditorView',
    'mixins/ExchangeableContent'
], function ($, _, Backbone, app, plainTemplate, GameObjectRecorderView, StartView, OpenLevelView, LevelEditorView, ExchangeableContent) {


    var BaseView = Backbone.View.extend(
        _.extend(new ExchangeableContent, {

        template: _.template(plainTemplate, {}),

            initialize: function () {
                this.configureExchangableContents({
                    callback_before: function () {
                        this.$el.html(this.template);
                    }.bind(this),
                    className: 'content',
                    contentsareinstances: true
                });

                this.addContents({
                    startview: new StartView(),
                    gameobjectrecorderview: new GameObjectRecorderView(),
                    openlevelview: new OpenLevelView(),
                    leveleditorview: new LevelEditorView()
                });
        },

        render: function () {
            if (app.models.levelEditorModel)
                this.setContent('leveleditor');
            else
                this.setContent('start');
        },

        onClose: function () {
            var currentContent = this.getCurrentContent();
            if (currentContent && currentContent.onClose)
                currentContent.onClose();
        }
        }));

    return BaseView;
});
