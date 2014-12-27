define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/panels/gameobjects.html',
    'views/levelbuilder/TapObjectRowView',
    'views/levelbuilder/ExportModalView',
    'app'
], function ($, _, Framework, Template, TapObjectRowView, ExportModalView, app) {
    var GameObjectEditorPanelView = Framework.View.extend({

        template: _.template(Template, {}),

        render: function (model) {
            this.model = model;
            this.$el.html(this.template);
            this.table = this.$('#tbody_gameobjects');
            this.table.html('');
            this.gameobjects = this.model.get('gameObjects');

            this.collectionview = new Framework.CollectionView({
                el: this.table,
                childView: TapObjectRowView,
                collection: this.gameobjects,
                getViewParams: function (gameobject) {
                    return gameobject;
                }.bind(this)
            });
            this.collectionview.render();
            this.listenTo(this.model, 'change:gameObjects', this.render, this);
        },


        events: {
            'click #record_gameobjects': 'recordGameObjects'
        },


        recordGameObjects: function recordgameobjects() {
            app.getMainView().setFullScreenContent(app.getMainView().views.levelbuilderview.getContent('gameobjectrecorder'), this.model);
        }
    });

    return GameObjectEditorPanelView;
});