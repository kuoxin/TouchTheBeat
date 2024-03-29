define([
    'jquery',
    'underscore',
    'Framework',
    'snap',
    'game/controller/TapObject',
    'game/Surface',
    'game/controller/AudioController',
    'game/renderer/AudioLoadingRenderer',
    'models/Track',
    'text!templates/levelbuilder/gameobjectrecorder.html',
    'app',
    'models/GameObject'
], function ($, _, Framework, Snap, TapObject, Surface, AudioController, AudioLoadingRenderer, Track, recordertemplate, app, GameObject) {
    var GameObjectRecorderView = Framework.View.extend({
        el: '#body',

        fullscreen: true,

        onClose: function () {
            if (this.audiocontroller) {
                this.audiocontroller.close();
            }
        },

        render: function (model) {
            this.model = model;

			if (this.audiocontroller) {
				this.audiocontroller.close();
			}

            var template = _.template(recordertemplate, {});
            this.$el.html(template);

            this.surface = new Surface({
				el: this.$('#surfaceSVG').el
            });
			this.surface.getRootRect().attr({
				bgcolor: '#0d0d0d'
			});
            this.audioloadingrenderer = new AudioLoadingRenderer({
                snap: this.surface.getSnap()
            });

			this.audioloadingrenderer.render();

            this.audiocontroller = new AudioController({
                renderer: this.audioloadingrenderer,
                callback_ended: this.recordingfinished.bind(this),
                callback_readytoplay: this.onAudioReady.bind(this),
                callback_error: this.onAudioError.bind(this)
            });

            this.audiocontroller.load(this.model.get('audio').getStreamUrl(), true);
        },

        addTapObject: function (timestamp, x, y) {
            this.model.get('gameObjects').add(
                new GameObject({"type": "Tap", "x": x, "y": y, "tapTime": timestamp})
            );
        },

        onAudioReady: function () {
			this.svgelem = document.getElementById('surfaceSVG');

            this.surface.requestStartFromUser(this.start.bind(this));
        },

        start: function () {
            this.audiocontroller.play();
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
            this.audiocontroller.close();
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
