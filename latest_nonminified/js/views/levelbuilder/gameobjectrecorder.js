define([
    'jquery',
    'underscore',
    'backbone',
    'snap',
    'gameclasses/TapObject',
    'views/audio',
    'utils/SoundcloudLoader',
    'text!templates/levelbuilder/gameobjectrecorder.html',
    'app'
], function ($, _, Backbone, Snap, TapObject, AudioController, SoundcloudLoader, recordertemplate, app) {
    var GameObjectRecorderView = Backbone.View.extend({
        el: '#body',
        render: function (sound) {

            this.sound = sound;
            this.gameobjects = [];

            if (this.audiocontroller)
                this.audiocontroller.dispose();

            var template = _.template(recordertemplate, {});
            this.$el.html(template);

            this.audiocontroller = new AudioController();
            this.audiocontroller.setCallbacks(this.onAudioStarted.bind(this), this.recordingfinished.bind(this), this.onAudioReady.bind(this), this.onAudioError.bind(this));
            this.audiocontroller.render(SoundcloudLoader.getStreamUrl(this.sound.stream_url), true);


            this.snap = new Snap('#svg');

            this.r = this.snap.rect(0, 0, "100%", "100%", 0);

            this.r.attr({
                fill: '#6699FF'
            });

            this.svgelem = document.getElementById('svg');

            this.r.touchstart(function (e) {
                if (this.isrecording) {
                    console.log("touch on surface");
                    var touch = e.changedTouches[0];

                    var pos = this.svgelem.createSVGPoint();
                    pos.x = touch.pageX;
                    pos.y = touch.pageY;

                    var ctm = e.target.getScreenCTM();

                    if (ctm = ctm.inverse()) {
                        pos = pos.matrixTransform(ctm);
                        console.log(JSON.stringify(pos));
                        this.addTapObject(this.audiocontroller.getCurrentTime(), Math.floor(pos.x), Math.floor(pos.y));
                        console.log(this.gameobjects[this.gameobjects.length - 1]);
                    } else {
                        console.error('error retrieving position');
                    }
                }
            }.bind(this));
        },

        addTapObjectAtRandomPosition: function (timestamp) {
            var x = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.width - TapObject.prototype.radius);
            var y = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.height - TapObject.prototype.radius);
            this.gameobjects.push({"type": "Tap", "x": x, "y": y, "taptime": timestamp});
        },

        addTapObject: function (timestamp, x, y) {
            this.gameobjects.push({"type": "Tap", "x": x, "y": y, "taptime": timestamp});
        },

        onAudioReady: function () {
            //TODO: show loading state / show when track starts
        },

        onAudioStarted: function () {
            this.isrecording = true;
        },

        onAudioError: function () {
            this.isrecording = false;
            console.error('Audio error!!!!!');
            this.audiocontroller.dispose();
        },

        recordingfinished: function () {
            this.isrecording = false;
            console.log('finished');
            app.setContent(app.router.levelbuilder_metadataview, this.sound, this.gameobjects);
        }


    });
    return GameObjectRecorderView;
});
/*


 });
 */