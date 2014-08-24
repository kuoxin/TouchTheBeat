define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/metadata.html',
    'util/scripts',
    'bootstrap'


], function ($, _, Backbone, app, levelbuilderTemplate) {
    var MetaDataView = Backbone.View.extend({
        el: '#content',

        initialize: function () {
        },

        render: function (sound, gameobjects) {
            console.log(gameobjects);
            console.log(sound);
            this.sound = sound;
            this.gameobjects = gameobjects;

            var template = _.template(levelbuilderTemplate, {});
            this.$el.html(template);

            $("#publish").fadeIn();

        },

        onClose: function () {
        },

        events: {
            'click #btn_publish': 'openPublish',
            'click #btn_playnow': 'playLevelNow'
        },


        openPublish: function openPublish() {
            this.createLevel();
            $("#leveljsoncontainer").html(JSON.stringify(this.level));
            $("#publish").slideUp();
            $("#finished").slideDown();
        },

        playLevelNow: function () {
            app.startlevel(this.level);
        },

        createLevel: function () {
            var level = {};
            level.audio = {};
            level.audio.stream_url = this.sound.stream_url;
            level.audio.permalink_url = this.sound.permalink_url;
            level.gameobjects = this.gameobjects;
            level.name = $("#levelname").val();
            level.track = {};
            level.track.title = this.sound.title;
            level.track.artist = this.sound.user.username;
            this.level = level;
        }
    });
    return MetaDataView;
});
