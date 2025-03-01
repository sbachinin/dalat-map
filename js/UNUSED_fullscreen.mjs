/* SUMMARY of my attempt to add fullscreen */
/* 
    It worked ok on my android, though transition was unpleasant
    On iphone se it didn't work
    On IOs situation with fullscreen is perhaps quite bad
    It can be unavailable or available only for video elements.
    Anyway it's difficult to test because this behaviour is likely
        to differ across version of safari etc.
    A proper solution might be quite complex -
        it will include hiding the button for certain browsers etc.
    For now I gave up in favour of PWA
*/

/* HTML for a button: */
/*
<div id="fullscreen-btn" class="hidden" title="Go fullscreen">
    <svg height="100%" version="1.1" viewBox="4 4 28 28" width="100%">
        <g class="ytp-fullscreen-button-corner-0">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-7"></use>
            <path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-7">
            </path>
        </g>
        <g class="ytp-fullscreen-button-corner-1">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-8"></use>
            <path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8">
            </path>
        </g>
        <g class="ytp-fullscreen-button-corner-2">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-9"></use>
            <path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-9">
            </path>
        </g>
        <g class="ytp-fullscreen-button-corner-3">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-10"></use>
            <path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-10">
            </path>
        </g>
    </svg>
    <svg height="100%" version="1.1" viewBox="4 4 28 28" width="100%">

        <g class="ytp-fullscreen-button-corner-2">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-247"></use>
            <path class="ytp-svg-fill" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" id="ytp-id-247"></path>
        </g>
        <g class="ytp-fullscreen-button-corner-3">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-248"></use>
            <path class="ytp-svg-fill" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" id="ytp-id-248"></path>
        </g>
        <g class="ytp-fullscreen-button-corner-0">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-249"></use>
            <path class="ytp-svg-fill" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" id="ytp-id-249"></path>
        </g>
        <g class="ytp-fullscreen-button-corner-1">
            <use class="ytp-svg-shadow" xlink:href="#ytp-id-250"></use>
            <path class="ytp-svg-fill" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" id="ytp-id-250"></path>
        </g>
    </svg>

</div>
*/



/* CSS for a button */
/* 
#fullscreen-btn {
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 6px;
    margin: 0 10px 5px 0;
    box-shadow: 0 0px 4px 1px rgba(60, 64, 67, 0.3);
}

#fullscreen-btn:hover {
    background-color: rgb(0 0 0/5%);
}

#fullscreen-btn.hidden {
    visibility: hidden;
    pointer-events: none;
}

#fullscreen-btn svg:last-child {
    display: none;
}

#fullscreen-btn.expanded svg:last-child {
    display: block;
}

#fullscreen-btn.expanded svg:first-child {
    display: none;
}
*/




const fullscreenBtn = document.getElementById('fullscreen-btn');

if (
    document.fullscreenEnabled ||
    document.mozFullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.msFullscreenEnabled
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

document.addEventListener('fullscreenchange', () => {
    const is_fullscreen = document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement

    fullscreenBtn.classList[is_fullscreen ? 'add' : 'remove']('expanded')
    fullscreenBtn.setAttribute('title', is_fullscreen ? 'Exit fullscreen' : 'Go fullscreen')
});