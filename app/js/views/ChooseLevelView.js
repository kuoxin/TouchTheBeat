define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/leveloverview.html',
    'views/LevelPanelView',
    'collections/LevelCollection',
    'app'
], function ($, _, Framework, LevelOverviewTemplate, LevelPanel, LevelCollection, app) {
    var ChooseLevelView = Framework.View.extend({

        initialize: function () {
            "use strict";
            this.levelcollection = new LevelCollection();
            this.collectionview = new Framework.CollectionView({
                className: 'list-group',
                childView: LevelPanel,
                collection: this.levelcollection,
                getViewParams: function (level) {
                    return {
                        model: level,
                        callback: this.levelSelectedCallback
                    };
                }.bind(this)
            });

        },

        levelSelectedCallback: function (level) {
            "use strict";
            app.startLevel(level);
        },

        render: function () {
            Framework.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewTemplate, {});
            this.$el.html(template);
            this.collectionview.render();
            this.$('#levelcollection_container').html(this.collectionview.el);

			this.levelcollection.fetch();

        },
        onClose: function () {
            "use strict";
            this.collectionview.close();
        }
    });
    return ChooseLevelView;
});
