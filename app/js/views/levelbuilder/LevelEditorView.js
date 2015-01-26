/**
 * Created by Hermann on 13.10.2014.
 */
define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/leveleditor.html',
    'views/levelbuilder/TapObjectRowView',
    'views/levelbuilder/ExportModalView',
    'views/levelbuilder/panels/AudioPanelView',
    'views/levelbuilder/panels/GameObjectEditorPanelView',
    'views/levelbuilder/panels/MetaDataPanelView',
    'app',
    'models/Level'
], function ($, _, Framework, Template, TapObjectRowView, ExportModalView, AudioPanelView, GameObjectEditorPanelView, MetaDataPanelView, app, Level) {

    var logmodel = function (model) {
        if (!_.isUndefined(model) && !_.isNull(model)) {
            console.warn('The current LevelEditor-draft will be overwritten. Trying to log the level-text as backup:');
            try {
                console.log(JSON.stringify(model.toJSON()));
            }
            catch (e) {
                console.error(e);
            }
        }
    };

    var LevelEditorView = Framework.View.extend({
        events: {
            'click #delete': 'delete',
            'click #export': 'export',
            'click #play': 'play',
            'click #publish': 'saveAndPublish'
        },

        getModel: function () {
			if (typeof this.model === 'undefined') {
				return this.createModel();
			}
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

        delete: function () {
            this.setModel(null);
            var levelbuilderview = app.getMainView().views.levelbuilderview;
            levelbuilderview.setContent('start');
        },

        export: function () {
            console.log(this.getModel().toJSON());
            this.exportmodalview.render(this.getModel().toJSON());
        },


        saveAndPublish: function () {
            this.getModel().save({}, {
                success: function (level) {
                    console.log(level);
                },
                error: function (level, error) {
                    console.log('error callback');
                    console.error(error);
                }
            });
        },

        playLevel: function () {
            app.startLevel(this.getModel());
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
                this.panels[k].render(this.getModel());
                this.$('#panellist').append(this.panels[k].el);
            }

            this.listenTo(this.getModel(), 'change:name', function () {
                this.$('#levelname').html(this.getModel().escape('name'));
            }.bind(this));
        },

        onClose: function () {
            this.exportmodalview.close();
            for (var k in this.panels) {
                this.panels[k].close();
            }
        }
    });

    return LevelEditorView;
});


