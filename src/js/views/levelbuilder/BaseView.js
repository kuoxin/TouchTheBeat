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
        _.extend(new ExchangeableContent(), {

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

                this.listenTo(app.session, 'change:logged_in', this.updateContent.bind(this));
        },

            checkroute: function () {
                if (!app.session.get('logged_in')) {
                    return 'signincall';
                }
            },

            render: function (subroute) {
            this.$el.html(this.template);
                if (typeof subroute !== 'undefined')
                    this.setContent(subroute);
            else
                    this.updateContent(app.session);
        },

        onClose: function () {
            var currentContent = this.getCurrentContent();
            if (currentContent && currentContent.onClose)
                currentContent.onClose();
        },

            updateContent: function (session) {
                // the signincall view takes care by itself to redirect to the previous route
                if (session.get('logged_in') && this.getCurrentContent() !== this.getContent('signincall')) {
                    this.setContent('start');
                }
                else {
                    if (!_.isUndefined(this.getContent('leveleditor').getModel()))
                        this.setContent('leveleditor');
                    else
                    this.setContent('start');

                }
        }

        }));

    return BaseView;
});
