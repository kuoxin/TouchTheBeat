// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var SoundcloudLoader = function(player, uiUpdater) {
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
    this.loadStream = function(track_url, successCallback, errorCallback) {
        SC.initialize({
            client_id: client_id
        });
        SC.get('/resolve', {url: track_url}, function(sound) {
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
                    self.streamUrl = function() {
                        return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + client_id;
                    }
                    successCallback();
                } else {
                    self.sound = sound;
                    self.streamUrl = function() {
                        return sound.stream_url + '?client_id=' + client_id;
                    };
                    successCallback();
                }
            }
        });
    };


    this.directStream = function(direction) {
        if (direction == 'toggle') {
            if (this.player.paused) {
                this.player.play();
            } else {
                this.player.pause();
            }
        }
        else if (this.sound.kind == "playlist") {
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


function createlevelJSON()
{
    var level = {};
    level.source = loader.sound.permalink_url;
    level.duration = loader.sound.duration;
    level.gameobjects = gameobjects;
    level.trackname = loader.sound.permalink;
    level.tracktitle = loader.sound.title;
    level.taglist = loader.sound.tag_list;
    level.name = $("#levelname").val();
    

    return JSON.stringify(level);
}

var UiUpdater = function() {
    var trackInfoPanel = document.getElementById('trackInfoPanel');
    var infoImage = document.getElementById('infoImage');
    var infoArtist = document.getElementById('infoArtist');
    var infoTrack = document.getElementById('infoTrack');

    this.clearInfoPanel = function() {
        // first clear the current contents
        infoArtist.innerHTML = "";
        infoTrack.innerHTML = "";
        trackInfoPanel.className = 'hidden';
    };
    this.update = function() {
        // update the track and artist into in the controlPanel
        var artistLink = document.createElement('a');
        artistLink.setAttribute('href', loader.sound.user.permalink_url);
        artistLink.innerHTML = loader.sound.user.username;
        var trackLink = document.createElement('a');
        trackLink.setAttribute('href', loader.sound.permalink_url);

        if (loader.sound.kind == "playlist") {
            trackLink.innerHTML = "<p>" + loader.sound.tracks[loader.streamPlaylistIndex].title + "</p>" + "<p>" + loader.sound.title + "</p>";
        } else {
            trackLink.innerHTML = loader.sound.title;
        }

        var image = loader.sound.artwork_url ? loader.sound.artwork_url : loader.sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
        infoImage.setAttribute('src', image);

        infoArtist.innerHTML = '';
        infoArtist.appendChild(artistLink);

        infoTrack.innerHTML = '';
        infoTrack.appendChild(trackLink);

        $('#trackinfo').fadeIn();
    };


};



// - Flow:
//trackselection
//trackinfo
//instructions
//finish

var loader;
var player;
var uiupdater;
var gameobjects;


function updateProgressIndicator()
{
    var percentage = player[0].currentTime / player[0].duration * 100;
    $("#progressbar").css('width', Math.floor(percentage * 10) / 10 + '%');
    if (player[0].currentTime != player[0].duration)
    {
        requestAnimationFrame(updateProgressIndicator);
    }
    else
    {
        capturingfinished();
    }
}

function capturingfinished() {

    $("#gameObjectPanel").fadeOut();
    $("#instructions").slideUp();
    $("#publish").fadeIn();

}

function loading_error() {
    console.log("error");
    //alert(loader.errorMessage);
    $("#alert_tracknotfound_text").html(loader.errorMessage);
    $("#alert_tracknotfound").slideDown();
}
;
function loading_success() {
    $("#alert_tracknotfound").slideUp();
    uiupdater.update();
    player.attr('src', loader.streamUrl());
    $("#trackinfo").fadeIn();
    $("#trackselection").slideUp();


}
;

$(document).ready(function() {
    loader = new SoundcloudLoader(null, null);
    player = $('#player');
    uiupdater = new UiUpdater();
    gameobjects = [];
    randomtracks = [
        'https://soundcloud.com/maxfrostmusic/white-lies',
        'https://soundcloud.com/greco-roman/roosevelt-sea-1',
        'https://soundcloud.com/t-e-e-d/garden',
        'https://soundcloud.com/homoheadphonico/phantogram-don-t-move',
        'https://soundcloud.com/etagenoir/parov-stelar-catgroove',
        'https://soundcloud.com/fosterthepeoplemusic/pumpedupkicks'
    ];


    $("#btn_entertrack").click(function() {
        loader.loadStream($("#input_entertrack").val(), loading_success, loading_error);
        /*$("#btn_entertrack").attr("disabled", true);
         $("#btn_recommendedtrack").attr("disabled", true);
         $("#input_entertrack").attr("disabled", true);*/
    });

    $("#btn_recommendedtrack").click(function() {
        $("#input_entertrack").val(randomtracks[Math.floor(Math.random() * (randomtracks.length - 1))]);
        $("#btn_entertrack").trigger("click");
    });

    $("#btn_gameobjectpanel").click(function() {
        $("#btn_gameobjectpanel").attr("disabled", true);
        $("#progress").fadeIn();
        $("#btn_gameobjectpanel").fadeOut();
        $('#player').trigger("play");
        updateProgressIndicator();

    });

    $("#btn_testbutton").click(function() {
        gameobjects.push(player[0].currentTime);
        console.log(gameobjects);
    });

    $("#btn_publish").click(function() {
        $("#publish").slideUp();
        $("#finished").slideDown();
    });

    $(window).keypress(function(e) {
        if (!player[0].paused)
        {
            console.log("keypress legitimate "+e.keyCode);
            if (e.keyCode == 32)
            {
                gameobjects.push(player[0].currentTime);
                console.log(gameobjects);
            }
        }

    });








});