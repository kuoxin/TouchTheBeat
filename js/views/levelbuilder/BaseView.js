define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/base.html',
    'views/levelbuilder/AudioSelectorView',
    'views/levelbuilder/GameObjectRecorderView',
    'views/levelbuilder/GameObjectEditorView',
    'views/levelbuilder/MetaDataView',
    'views/levelbuilder/StartView',
    'views/levelbuilder/OpenLevelView'
], function ($, _, Backbone, plainTemplate, AudioSelectorView, GameObjectRecorderView, GameObjectEditorView, MetaDataView, StartView, OpenLevelView) {
    var BaseView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        currentContent: null,

        contents: {
            startview: new StartView(),
            audioselectorview: new AudioSelectorView(),
            gameobjectrecorderview: new GameObjectRecorderView(),
            metadataview: new MetaDataView(),
            openlevelview: new OpenLevelView(),
            gameobjecteditorview: new GameObjectEditorView()
        },

        initialize: function () {
        },

        render: function () {
            this.$el.html(this.template);
        },

        setContent: function (view, args) {
            if (this.currentContent != null) {
                if (this.currentContent.onClose)
                    this.currentContent.onClose();

                this.currentContent.dispose();
            }
            this.currentContent = view;
            this.$('.content').html('');
            this.currentContent.setElement($('.content'));
            this.currentContent.render.apply(this.currentContent, args);
            //this.$('.content').html(this.currentContent.el);

        }
    });

    return BaseView;
});
