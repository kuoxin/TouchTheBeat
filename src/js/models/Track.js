define([
    'jquery',
    'underscore',
    'Framework'
], function ($, _, Framework) {

    var Track = Framework.Model.extend({
        urlRoot: 'audio/soundcloud',

        validate: function (data) {
            if ('url' in data) {
                if (!data.url.match(Track.regex)) {
                    return Track.errorMessages.WRONGFORMAT;
                }
            }
        },

        parse: function (data, options) {
            var error = options.error;
            console.log('parsing');
            if (typeof error !== 'undefined') {
                if (data.kind !== 'track') {
                    error(Track.errorMessages.NOTRACK, options);
                    return;
                }
                if (!data.streamable) {
                    error(Track.errorMessages.NOTSTREAMABLE, options);
                    return;
                }
            }

            this.clear({silent: true});
            return {
                streamUrl: data.stream_url,
                permalinkUrl: data.permalink_url,
                artist: data.user.username,
                title: data.title,
                duration: data.duration,
                artworkUrl: data.artwork_url,
                avatarUrl: data.avatar_url,
                artistUrl: data.user.permalink_url
            };
        },

        getStreamUrl: function () {
            // to get an ID go to http://developers.soundcloud.com/
            return this.get('streamUrl') + '?client_id=' + "1dfc22b8b6e9ae1fd500cf90f9065607";
        },

        getDurationString: function () {
            "use strict";
            var ms = this.get('duration');
            if (ms) {
                ms = 1000 * Math.round(ms / 1000); // round to nearest second
                var seconds = ((ms % 60000) / 1000);
                return Math.floor(ms / 60000) + ":" + (seconds < 10 ? '0' : '') + seconds;
            }
            else {
                return 'unknown';
            }
        }
    });
    /*

     var SoundcloudLoader = {
     loadStream: function (track_url, successCallback, errorCallback) {
            console.log('resolving: ' + track_url);
            if (!track_url.match(regex)) {
                errorCallback(errorMessages['WRONGFORMAT']);
                return;
            }

     API.request('GET',  + encodeURIComponent(encodeURIComponent(track_url)), {
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
        }


     };*/

    Track.regex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
    Track.errorMessages = {};
    Track.errorMessages.CONTACTIFERRORSTAYS = 'Please check if the url is correct, try again and contact me if the error still occurs.';
    Track.errorMessages.SOUNDCLOUDERROR = 'Sorry. The track you entered could not be found. ' + Track.errorMessages.CONTACTIFERRORSTAYS;
    Track.errorMessages.NOTRACK = 'Sorry. The URL you entered is not a valid Soundcloud-Track. ' + Track.errorMessages.CONTACTIFERRORSTAYS;
    Track.errorMessages.NOTSTREAMABLE = 'Sorry. The track you entered is not streamable. Please select a different one.';
    Track.errorMessages.WRONGFORMAT = 'Please make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';


    return Track;
});