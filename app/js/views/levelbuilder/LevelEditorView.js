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
            'click #export': 'export',
            'click #play': 'play',
			'click #save': 'save'
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


        export: function () {
            console.log(this.getModel().toJSON());
            this.exportmodalview.render(this.getModel().toJSON());
        },


		save: function () {
			this.onClose();
			var isNew = !this.getModel().isPublished();

            this.getModel().save({}, {
				success: function () {
					if (isNew) {
						app.getMainView().notify({
							content: "Your level was published successfully."
						});
					}
					else {
						app.getMainView().notify({
							content: "Your level has been updated successfully."
						});
					}
                }
            });
			this.render();
        },

        playLevel: function () {
            app.startLevel(this.getModel());
        },

		initialize: function () {
			this.panels = {
				metadatapanel: new MetaDataPanelView(),
				audiopanel: new AudioPanelView(),
				gameobjecteditorpanel: new GameObjectEditorPanelView()
			};

			this.exportmodalview = new ExportModalView();
		},

        render: function () {
            var template = _.template(Template, {
                levelname: this.getModel().get('name') || 'New Level',
				username: this.getModel().get('owner').get('username'),
				isPublished: this.getModel().isPublished()
            });
            this.$el.html(template);

			this.$el.append(this.exportmodalview.el);

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


