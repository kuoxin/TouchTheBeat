define([
  'jquery'
], function ($){

	var SoundcloudLoader = function () {
		var self = this;
		var client_id = "1dfc22b8b6e9ae1fd500cf90f9065607"; // to get an ID go to http://developers.soundcloud.com/
		this.sound = {};
		this.errorMessage = "";

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
                    self.errorMessage = "";
                    try {
                        self.sound = data;
                        self.streamUrl = function () {
                            return self.sound.stream_url + '?client_id=' + client_id;
                        };
                        if (self.sound.errors) {
                            self.errorMessage = "";
                            for (var i = 0; i < self.sound.errors.length; i++) {
                                self.errorMessage += self.sound.errors[i].error_message + '<br>';
                            }
                            self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
                            errorCallback();
                        }
                        else {
                            console.log('loaded track successfully');
                            successCallback();
                        }
                    }
                    catch(e){
                        self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
                        errorCallback();
                    }
            });
        }

		this.loadStream = function (track_url, successCallback, errorCallback) {
            this.loadStreamWithTunnel(track_url, successCallback, errorCallback);
		};

        this.streamUrl = function () {
            return this.streamUrl(self.sound);
        };

        this.streamUrl = function (sound) {
            console.log(sound);
            return sound.uri + '?client_id=' + client_id;
        };


	};
	return SoundcloudLoader;
});