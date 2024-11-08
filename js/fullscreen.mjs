const fullscreenBtn = document.getElementById('fullscreen-btn');

if (
    document.documentElement.requestFullscreen
    || document.documentElement.mozRequestFullScreen
    || document.documentElement.webkitRequestFullscreen
    || document.documentElement.msRequestFullscreen
) {
    fullscreenBtn.addEventListener('click', function () {
        if (document.fullscreenElement) {
            exitFullscreen();
        } else {
            goFullscreen();
        }
    });
    fullscreenBtn.classList.remove('hidden')
}

// Enter fullscreen
function goFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
}

// Exit fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}