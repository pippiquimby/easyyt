// --- Global Configuration ---
const params = new URLSearchParams(document.location.search);
const ytvideo = params.get("video");
const cookiename = "ply_time" + ytvideo;
let player;

// --- YouTube API Initialization ---
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: ytvideo,
        playerVars: {
            color: 'white'
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

// --- Player State & Event Handlers ---
function onPlayerReady() {
    const savedTime = readCookie(cookiename);
    if (savedTime) {
        player.seekTo(savedTime);
    }
}

function onPlayerStateChange() {
    createCookie(cookiename, player.getCurrentTime(), 14);
}

// Save position when user leaves the page
window.onbeforeunload = function() {
    if (player && typeof player.getCurrentTime === 'function') {
        createCookie(cookiename, player.getCurrentTime(), 14);
    }
};

// --- jQuery Controls ---
$('#play').on('click', function () {
    player.playVideo();
});

$('#pause').on('click', function () {
    player.pauseVideo();
});

$('#mute-toggle').on('click', function() {
    const mute_toggle = $("#mute");

    if (player.isMuted()) {
        player.unMute();
        mute_toggle.text('volume_up');
    } else {
        player.mute();
        mute_toggle.text('volume_off');
    }
});

$('.thumbnail').on('click', function () {
    const url = $(this).attr('data-video-id');
    player.cueVideoById(url);
});

// --- Cookie Helper Functions ---
function createCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax";
}

function readCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
