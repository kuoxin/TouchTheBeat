define([
    'jquery',
    'util/api'
], function ($, API) {
    var regex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;

    var errorMessages = {
        SOUNDCLOUDERROR: 'Sorry. The track you entered could not be found. Please check if the url is correct, try again and contact me if the error still occurs.',
        NOTSTREAMABLE: 'Sorry. The track you entered is not streamable. Please select a different one.',
        WRONGFORMAT: 'Please make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track'
    };

    var SoundcloudLoader = {
        loadStream: function (track_url, successCallback, errorCallback) {
            console.log('resolving: ' + track_url);
            if (!track_url.match(regex)) {
                errorCallback(errorMessages['WRONGFORMAT']);
                return;
            }

            API.request('GET', 'audio/soundcloud/' + encodeURIComponent(encodeURIComponent(track_url)), {
                success: function resolveTrack(data) {
                    if (!data.streamable) {
                        errorCallback(errorMessages['NOTSTREAMABLE']);
                        return;
                    }
                    else {
                        successCallback(data);
                    }
                },
                error: function () {
                    errorCallback(errorMessages['SOUNDCLOUDERROR']);
                }
            });
        },

        getStreamUrl: function (url) {
            // to get an ID go to http://developers.soundcloud.com/
            return url + '?client_id=' + "1dfc22b8b6e9ae1fd500cf90f9065607";
        }
    };
    return SoundcloudLoader;
});