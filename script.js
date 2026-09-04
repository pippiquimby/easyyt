var player,
    time_update_interval = 0;
	let params = new URLSearchParams(document.location.search);
let ytvideo = params.get("video") ;  
 
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: ytvideo,
        playerVars: {
            color: 'white',
             
        },
        events: {
            onReady: initialize,
	
            onStateChange: onPlayerStateChange,
        }
    });
}

function initialize(){
	onPlayerReady();
                   

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(player.getVolume()));
 
}


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
   // $('#current-time').text(formatTime( player.getCurrentTime() ));
   // $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
   // $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}


// Progress bar

$('#progress-bar').on('mouseup touchend', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.seekTo(newTime);

});

$('#forward').on('click', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getCurrentTime() + 15;

    // Skip video to new time.
    player.seekTo(newTime);

});

$('#back').on('click', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getCurrentTime() - 15;

    // Skip video to new time.
    player.seekTo(newTime);

});


// Playback

$('#play').on('click', function () {
    player.playVideo();
});


$('#pause').on('click', function () {
    player.pauseVideo();
});


 
 
$('#mute-toggle').on('click', function() {
    var mute_toggle = $("#mute");

    if(player.isMuted()){
        player.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
    }
});
 

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$('.thumbnail').on('click', function () {

    var url = $(this).attr('data-video-id');

    player.cueVideoById(url);

});


 

  function onPlayerStateChange() {
            createCookie('ply_time', player.getCurrentTime(), 1);  // Stats like buffer, Pause and play store time in Cookes 

        }

        function onPlayerReady() {
            player.seekTo(readCookie('ply_time'));  // On ready get ccokies  and start vide from that.
        }

        document.unload = function() {                              // On docucment unload set cookie
            createCookie('ply_time', player.getCurrentTime(), 1);
        }

        window.onbeforeunload = function() {              // On Window unload set cookie
            createCookie('ply_time', player.getCurrentTime(), 1);
        }


        /* 
         * Start:-  function to create , read and erase Cookie 
         */

        function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else
                var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name, "", -1);
        }

        /* 
         * End:-  function to create , read and erase Cookie 
         */
