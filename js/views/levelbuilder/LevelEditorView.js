/**
 * Created by Hermann on 13.10.2014.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/leveleditor.html',
    'views/levelbuilder/TapObjectRowView',
    'views/levelbuilder/ExportModalView',
    'views/levelbuilder/panels/AudioPanelView',
    'views/levelbuilder/panels/GameObjectEditorPanelView',
    'views/levelbuilder/panels/MetaDataPanelView',
    'app'
], function ($, _, Backbone, Template, TapObjectRowView, ExportModalView, AudioPanelView, GameObjectEditorPanelView, MetaDataPanelView, app) {
    var LevelEditorView = Backbone.View.extend({
        events: {
            'click #delete': 'deleteDraft',
            'click #export': 'exportDraft',
            'click #save': 'saveDraft',
            'click #play': 'playLevel'
        },

        deleteDraft: function () {
            console.log('triggered');
            app.models.levelEditorModel = null;
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent('start');
        },

        exportDraft: function () {
            console.log(this.getModel().toJSON());
            this.exportmodalview.render(this.getModel().toJSON());
        },

        saveDraft: function () {
        },

        playLevel: function () {
            app.startlevel(app.getLevelEditorModel());
        },

        getModel: function () {
            return app.getLevelEditorModel();
        },

        render: function () {
            var template = _.template(Template, {
                levelname: this.getModel().get('name') || 'New Level',
                username: this.getModel().get('owner').get('username')
            });
            this.$el.html(template);
            this.exportmodalview = new ExportModalView();
            this.$el.append(this.exportmodalview.el);

            this.panels = {
                metadatapanel: new MetaDataPanelView(),
                audiopanel: new AudioPanelView(),
                gameobjecteditorpanel: new GameObjectEditorPanelView()
            };

            this.$('#panellist').html('');

            for (var k in this.panels) {
                this.panels[k].render();
                this.$('#panellist').append(this.panels[k].el);
            }

            this.listenTo(this.getModel(), 'change:name', function () {
                this.$('#levelname').html(this.getModel().escape('name'));
            }.bind(this));


        },

        onClose: function () {
            this.exportmodalview.remove();

            for (var k in this.panels) {
                this.panels[k].remove();
            }
        }
    });

    return LevelEditorView;
});


