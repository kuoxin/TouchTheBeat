define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var regex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
    var errorMessages = {
        SOUNDCLOUDERROR: 'Sorry. The track you entered could not be found. Please check if the url is correct, try again and contact me if the error still occurs.',
        NOTSTREAMABLE: 'Sorry. The track you entered is not streamable. Please select a different one.',
        WRONGFORMAT: 'Please make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track'
    };

    var Track = Backbone.Model.extend({
        url: 'audio/soundcloud',

        validate: function (data) {
            console.log('validation');
            console.log(data);

            /*
             *             if (!trackURL.match(regex)) {
             return errorMessages['WRONGFORMAT'];
             }*/
        },

        parse: function (data) {
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
        }

        /*toJSON : function(){
         return _.pick(Backbone.Model.prototype.toJSON.call(this), '')
         }*/

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

    return Track;
});