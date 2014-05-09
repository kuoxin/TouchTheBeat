//taken from http://demosthenes.info/blog/708/Introducing-the-HTML5-FullScreen-API
function launchFullScreen(element) {
    if (element.requestFullscreen)
    {
        element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen)
    {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullscreen)
    {
        element.webkitRequestFullscreen();
    }
    else if (element.msRequestFullscreen)
    {
        element.msRequestFullscreen();
    }
}

function cancelFullScreen() {
if (document.exitFullscreen) {
document.exitFullscreen();
} else if (document.mozCancelFullScreen) {
document.mozCancelFullScreen();
} else if (document.webkitExitFullscreen) {
document.webkitExitFullscreen();
} else if (document.msExitFullscreen) {
document.msExitFullscreen();
}
}

function start()
{
    $("#svg").show();
    launchFullScreen($("#svg")[0]);
}

document.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, false);
document.addEventListener("touchstart", function(event) {
    event.preventDefault();
}, false);
$("#svg").height($(window).height() - 160);
$(window).resize(function() {
    $("#svg").height($(window).height() - 160);
});
var s = new Snap('#svg');

var r = s.rect(0, 0, "100%", "100%", 0);
r.touchend(function() {
    console.log("touchend");
});

$("#btn_start").click(function(){
    start();
});