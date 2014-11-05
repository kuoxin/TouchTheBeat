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
    'app',
    'models/Level'
], function ($, _, Backbone, Template, TapObjectRowView, ExportModalView, AudioPanelView, GameObjectEditorPanelView, MetaDataPanelView, app, Level) {

    var logmodel = function (model) {
        if (!_.isUndefined(model)) {
            console.warn('The current LevelEditor-draft will be overwritten. Trying to log the level-text as backup:');
            try {
                console.log(JSON.stringify(model.toJSON()));
            }
            catch (e) {
                console.error(e);
            }
        }
    };

    var LevelEditorView = Backbone.View.extend({
        events: {
            'click #delete': 'deleteDraft',
            'click #export': 'exportDraft',
            'click #save': 'saveDraft',
            'click #play': 'playLevel',
            'click #publish': 'publishLevel'
        },

        getModel: function () {
            return this.model;
        },

        setModel: function (model) {
            logmodel(this.model);
            this.model = model;
        },


        createModel: function (soundcloudURL) {
            this.setModel(soundcloudURL ? Level.createFromSoundCloud(soundcloudURL) : new Level());
            return this.getModel();
        },

        deleteDraft: function () {
            this.setModel(undefined);
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent('start');
        },

        exportDraft: function () {
            console.log(this.getModel().toJSON());
            this.exportmodalview.render(this.getModel().toJSON());
        },

        saveDraft: function () {
        },

        publishLevel: function () {
            /*
             var level = new Level(this.model.toJSON());
             level.save({
             success: function(){
             console.log(arguments);
             },
             error: function(){
             console.log(arguments);
             }
             });
             */
        },

        playLevel: function () {
            app.startlevel(this.getModel());
        },

        render: function () {
            if (_.isUndefined(this.getModel())) {
                this.createModel();
            }

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
                this.panels[k].render(this.getModel());
                this.$('#panellist').append(this.panels[k].el);
            }

            this.listenTo(this.getModel(), 'change:name', function () {
                this.$('#levelname').html(this.getModel().escape('name'));
            }.bind(this));


        },

        onClose: function () {
            this.exportmodalview.dispose();
            for (var k in this.panels) {
                this.panels[k].dispose();
            }
        }
    });

    return LevelEditorView;
});


