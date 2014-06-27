define([
  'jquery' //,  'soundcloud'
], function ($){//, sc) {
	var SoundcloudLoader = function (player, uiUpdater) {
		var self = this;
		var client_id = "1dfc22b8b6e9ae1fd500cf90f9065607"; // to get an ID go to http://developers.soundcloud.com/
		this.sound = {};
		this.streamUrl = "";
		this.errorMessage = "";
		this.player = player;
		this.uiUpdater = uiUpdater;

		/**
		 * Loads the JSON stream data object from the URL of the track (as given in the location bar of the browser when browsing Soundcloud),
		 * and on success it calls the callback passed to it (for example, used to then send the stream_url to the audiosource object).
		 */

		//SC.initialize({
		//	client_id: client_id
		//});

        this.loadStreamWithTunnel = function (track_url, successCallback, errorCallback) {
            $.get( "//dev.coloreddrums.de/ttb/server/gettrack.php",{p: track_url}).done(
                function resolveTrack( data ) {
                    self.sound = JSON.parse(data);
                    console.log(self.sound);
                    self.streamUrl = function () {
                        return self.sound.stream_url + '?client_id=' + client_id;
                    };
                    console.log('loaded track successfully');
                    successCallback();
            });
        }

		this.loadStream = function (track_url, successCallback, errorCallback) {
            this.loadStreamWithTunnel(track_url, successCallback, errorCallback);
		};

        this.loadStreamDirectly = function (track_url, successCallback, errorCallback){
            SC.get('/resolve', {
                url: track_url
            }, function (sound) {
                console.log(sound);
                if (sound.errors) {
                    self.errorMessage = "";
                    for (var i = 0; i < sound.errors.length; i++) {
                        self.errorMessage += sound.errors[i].error_message + '<br>';
                    }
                    self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
                    errorCallback();
                } else {

                    if (sound.kind == "playlist") {
                        self.sound = sound;
                        self.streamPlaylistIndex = 0;
                        self.streamUrl = function () {
                            return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + client_id;
                        }
                        successCallback();
                    } else {
                        self.sound = sound;
                        self.streamUrl = function () {
                            return sound.stream_url + '?client_id=' + client_id;
                        };
                        successCallback();
                    }
                }
            });
        }

		this.directStream = function (direction) {
			if (direction == 'toggle') {
				if (this.player.paused) {
					this.player.play();
				} else {
					this.player.pause();
				}
			} else if (this.sound.kind == "playlist") {
				if (direction == 'coasting') {
					this.streamPlaylistIndex++;
				} else if (direction == 'forward') {
					if (this.streamPlaylistIndex >= this.sound.track_count - 1)
						this.streamPlaylistIndex = 0;
					else
						this.streamPlaylistIndex++;
				} else {
					if (this.streamPlaylistIndex <= 0)
						this.streamPlaylistIndex = this.sound.track_count - 1;
					else
						this.streamPlaylistIndex--;
				}
				if (this.streamPlaylistIndex >= 0 && this.streamPlaylistIndex <= this.sound.track_count - 1) {
					this.player.setAttribute('src', this.streamUrl());
					this.uiUpdater.update(this);
					this.player.play();
				}
			}
		}


	};
	return SoundcloudLoader;
});