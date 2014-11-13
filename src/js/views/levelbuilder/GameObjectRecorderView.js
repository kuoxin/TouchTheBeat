define([
    'jquery',
    'underscore',
    'backbone',
    'snap',
    'gameclasses/TapObject',
    'gameclasses/Surface',
    'util/AudioController',
    'models/Track',
    'text!templates/levelbuilder/gameobjectrecorder.html',
    'app',
    'models/GameObject'
], function ($, _, Backbone, Snap, TapObject, Surface, AudioController, Track, recordertemplate, app, GameObject) {
    var GameObjectRecorderView = Backbone.View.extend({
        el: '#body',
        //TODO: test with latest refactoring
        onClose: function () {
            if (this.audiocontroller) {
                this.audiocontroller.onClose();
                this.audiocontroller.dispose();
            }
        },

        render: function (model) {
            this.model = model;
            if (this.audiocontroller)
                this.audiocontroller.dispose();

            var template = _.template(recordertemplate, {});
            this.$el.html(template);

            this.audioloaderview = app.router.views.audioloaderview;
            this.audioloaderview.render({bgcolor: '#222222'});

            this.audiocontroller = new AudioController();
            this.audiocontroller.attachAudioLoadingView(this.audioloaderview);
            this.audiocontroller.setCallbacks(this.onAudioStarted.bind(this), this.recordingfinished.bind(this), this.onAudioReady.bind(this), this.onAudioError.bind(this));
            this.audiocontroller.render(this.model.get('audio').getStreamUrl(), true);

        },

        /* addTapObjectAtRandomPosition: function (timestamp) {
         var x = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.width - TapObject.prototype.radius);
         var y = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.height - TapObject.prototype.radius);
         this.gameobjects.push({"type": "Tap", "x": x, "y": y, "taptime": timestamp});
         }, */

        addTapObject: function (timestamp, x, y) {
            this.model.get('gameObjects').add(
                new GameObject({"type": "Tap", "x": x, "y": y, "tapTime": timestamp})
            );
        },

        onAudioReady: function () {
            this.surface = new Surface({bgcolor: '#222222'});
            this.svgelem = document.getElementById('svg');
            this.surface.requestStartFromUser(this.audiocontroller.start.bind(this.audiocontroller));
        },

        onAudioStarted: function () {
            this.isrecording = true;
            this.surface.getRootRect().touchstart(function (e) {
                if (this.isrecording) {
                    var touch = e.changedTouches[0];

                    var pos = this.svgelem.createSVGPoint();
                    pos.x = touch.pageX;
                    pos.y = touch.pageY;

                    var ctm = e.target.getScreenCTM().inverse();

                    if (ctm) {
                        pos = pos.matrixTransform(ctm);
                        console.log(JSON.stringify(pos));
                        this.addTapObject(this.audiocontroller.getCurrentTime(), Math.floor(pos.x), Math.floor(pos.y));
                    } else {
                        console.error('error retrieving position');
                    }
                }
            }.bind(this));
        },

        onAudioError: function () {
            this.isrecording = false;
            console.error('Audio error!!!!!');
            this.audiocontroller.dispose();
            alert("There was an error loading the audio file.");
        },

        recordingfinished: function () {
            this.isrecording = false;
            console.log('finished');
            app.router.openLevelBuilder('leveleditor');
        }


    });
    return GameObjectRecorderView;
});
/*


 });
 */