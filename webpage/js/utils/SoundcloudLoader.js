define([
  'jquery'
], function ($){

	var SoundcloudLoader = {

        loadStream : function (track_url, successCallback, errorCallback){
            console.log('resolving: '+track_url);
            $.get( "//dev.coloreddrums.de/ttb/server/gettrack.php",{p: track_url}).done(
                function resolveTrack( data ) {
                    try {
                        if (data.errors) {
                            errorCallback('There was an error loading the track from SoundCloud. Please try again later or contact me if the error still occurs.');
                        }
                        if (!data.streamable){
                            errorCallback('Sorry. The track you entered is not streamable. Please select a different one.');
                        }
                        else {
                            var sound = data;
                            // to get an ID go to http://developers.soundcloud.com/
                            sound.streamUrl = sound.stream_url + '?client_id=' + "1dfc22b8b6e9ae1fd500cf90f9065607";
                            console.log('resolved: '+ sound.streamUrl);
                            successCallback(sound);
                        }
                    }
                    catch(e){
                        console.error(e);
                        errorCallback('Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track');
                    }
                });
        }
    };
	return SoundcloudLoader;
});