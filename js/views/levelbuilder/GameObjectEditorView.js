define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor.html',
    'views/components/html/gameobjecteditor/TapObjectRowView',
    'views/components/html/ExportModalView',
    'app'
], function ($, _, Backbone, Template, TapObjectRowView, ExportModalView, app) {
    var GameObjectEditorView = Backbone.View.extend({

        template: _.template(Template, {}),

        initialize: function () {
        },

        events: {
            'click #delete': 'deleteDraft',
            'click #export': 'exportDraft',
            'click #save': 'saveDraft'
        },

        deleteDraft: function () {
            console.log('triggered');
            app.models.levelEditorModel = null;
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent(levelbuilderview.contents.startview);
        },

        exportDraft: function () {
            console.log(app.models.levelEditorModel.toJSON());
            this.exportmodalview.render(app.models.levelEditorModel.toJSON());
        },

        saveDraft: function () {
        },


        render: function () {
            this.$el.html(this.template);
            this.exportmodalview = new ExportModalView();
            this.$el.append(this.exportmodalview.el);
            this.table = this.$('#tbody_gameobjects');
            this.table.html('');
            var i = 1;
            app.models.levelEditorModel.get('gameObjects').forEach(function (gameobject) {
                if (gameobject.get('type') == 'Tap') {
                    var view = new TapObjectRowView(gameobject);
                    view.render(i++);
                    this.table.append(view.el);
                }

            }.bind(this));

        }
    });

    return GameObjectEditorView;
});