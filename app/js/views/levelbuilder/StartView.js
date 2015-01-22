define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/start.html',
    'app',
    'collections/UserLevelCollection',
    'views/LevelPanelView'
], function ($, _, Framework, plainTemplate, app, UserLevelCollection, LevelPanelView) {
    var StartLevelBuilderView = Framework.View.extend({

        template: _.template(plainTemplate, {}),

        initialize: function () {
            "use strict";
            this.levelcollection = new UserLevelCollection();
            this.collectionview = new Framework.CollectionView({
                className: 'list-group',
                childView: LevelPanelView,
                collection: this.levelcollection,
                getViewParams: function (level) {
                    return {
                        model: level,
                        callback: this.levelSelectedCallback
                    };
                }.bind(this)
            });
        },

        events: {
            'click #new': 'create'
        },

        levelSelectedCallback: function (level) {
            "use strict";
            var levelbuilderview = app.getMainView().views.levelbuilderview;
            levelbuilderview.getContent('leveleditor').setModel(level);
            levelbuilderview.setContent('leveleditor');
            level.fetch();
        },

        create: function () {
            var levelbuilderview = app.getMainView().views.levelbuilderview;
            var leveleditor = levelbuilderview.getContent('leveleditor');
            var model = leveleditor.getModel();
			if (!model) {
				model = leveleditor.createModel();
			}
            levelbuilderview.setContent('leveleditor');
        },

        render: function () {
            this.$el.html(this.template);
            this.collectionview.render();
            this.$('#levelcontainer').html(this.collectionview.el);
            this.levelcollection.fetch();
        }
    });

    return StartLevelBuilderView;
});
