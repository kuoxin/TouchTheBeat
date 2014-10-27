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
    'views/levelbuilder/SignInCallView',
    'mixins/ExchangeableContent'
], function ($, _, Backbone, app, plainTemplate, GameObjectRecorderView, StartView, OpenLevelView, LevelEditorView, SignInCallView, ExchangeableContent) {


    var BaseView = Backbone.View.extend(
        _.extend(new ExchangeableContent, {

        template: _.template(plainTemplate, {}),

            initialize: function () {
                this.configureExchangableContents({
                    callback_before: this.checkroute.bind(this),
                    className: 'content',
                    contentsareinstances: true
                });

                this.addContents({
                    startview: new StartView(),
                    gameobjectrecorderview: new GameObjectRecorderView(),
                    openlevelview: new OpenLevelView(),
                    leveleditorview: new LevelEditorView(),
                    signincall: new SignInCallView()
                });

                this.listenTo(app.session, 'change:logged_in', this.updateloginstate.bind(this));
        },

            checkroute: function (route, args) {
                if (!app.session.get('logged_in')) {
                    return 'signincall';
                }
            },

        render: function () {
            this.$el.html(this.template);
            if (app.models.levelEditorModel)
                this.setContent('leveleditor');
            else
                this.setContent('start');
        },

        onClose: function () {
            var currentContent = this.getCurrentContent();
            if (currentContent && currentContent.onClose)
                currentContent.onClose();
        },

            updateloginstate: function (session) {
                if (session.get('logged_in')) {
                    this.setContent('start');
                }
        }
        }));

    return BaseView;
});
