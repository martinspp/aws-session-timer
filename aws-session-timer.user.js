// ==UserScript==
// @name         aws session timer
// @namespace    https://github.com/martinspp/aws-session-timer
// @version      0.2
// @description  adds a timer for the aws session
// @author       martinspp
// @match        https://*.console.aws.amazon.com/*
// @icon         https://i.imgur.com/ATs2rHH.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.slim.min.js
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @noframes
// ==/UserScript==

/* globals $ waitForKeyElements */

(function(){
    'use strict';
    waitForKeyElements("#awsc-nav-scallop-icon-container", addTimer, true)
})();
function addTimer() {
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    $("#awsc-nav-scallop-icon-container").before(`
       <div class="_scallop-icon-container_12km3_10" style="align-items: center;">
          <span style=" display:flex; color: #FFFFFF; font-size:2rem; font-family:'Amazon Ember', 'Helvetica Neue', Roboto, Arial, sans-serif; line-height: 1;
    white-space: nowrap; user-select: none;" class="globalNav-12174 globalNav-129" id=timer>
             XX:XX
          </span>
       </div>`);

    const timer = document.getElementById("timer")
    if(!timer){return false} // failed to create timer
    var urlParams = new URLSearchParams(window.location.search);
    var urlRegion = urlParams.get('region');
    var region = urlRegion
    if(!urlRegion){
        //If region not in params just default to eu-west-1
        region = "eu-west-1"
    }

    window.cookieStore.get("aws-signer-token_"+region).then((cookie)=>{
        var cookieExpirationDate = cookie.expires
        var now = new Date();
        var distance = cookieExpirationDate - now;
        if(!distance){return false}// most probably failed to retrieve cookie

        var y = setInterval(function(){

            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timer.innerHTML = minutes + ":" + seconds;
            distance-=1000
            if (minutes < 5 ){
                seconds % 2 ? timer.style.color='red' : timer.style.color='yellow'
            }
            if (seconds % 10 == 0){
                now = new Date();
                distance = cookieExpirationDate - now
            }
            if (distance < 0){
                timer.innerHTML = "OUT OF TIME"
                clearInterval(y)
            }
            return false
        }, 1000);
    });
    return false;
};
