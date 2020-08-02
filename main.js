// ==UserScript==
// @name         Youtube Playlist Total Time
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the total time in a youtube playlist!
// @author       You
// @match        https://www.youtube.com/playlist*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function calculateTotalTimeInSeconds() {
        let timeSpans = document.querySelectorAll('span.ytd-thumbnail-overlay-time-status-renderer');
        let totalTimeInSeconds = 0;

        for(let timeSpan of timeSpans) {
            let mult = 1;
            let times = timeSpan.innerText.split(':').reverse();

            for (let time of times) {
                totalTimeInSeconds += parseInt(time) * mult;
                mult *= 60;
            }
        }

        return totalTimeInSeconds;
    }

    function convertSecondsToHmsString(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor(totalSeconds % 3600 / 60);
        let seconds = Math.floor(totalSeconds % 3600 % 60);

        let hDisplay = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
        let mDisplay = minutes > 0 ? `${minutes.toString().padStart(2, '0')}:`: '00:';
        let sDisplay = seconds > 0 ? `${seconds.toString().padStart(2, '0')}`: '00';

        return hDisplay + mDisplay + sDisplay;
    }

    function appendToYoutube(displayTime) {
        let statsDiv = document.querySelector('#stats');
        let newElement = document.createElement('yt-formatted-string');

        newElement.classList.add('style-scope');
        newElement.classList.add('ytd-playlist-sidebar-primary-info-renderer');
        newElement.id = 'playlist-total-time';

        statsDiv.appendChild(newElement);

        let totalTimeElement = document.getElementById('playlist-total-time');
        totalTimeElement.innerHTML = displayTime;
    }

    setTimeout(function() {
        let totalTime = calculateTotalTimeInSeconds();
        let convertedTime = convertSecondsToHmsString(totalTime);

        appendToYoutube(convertedTime);
    }, 5000);
})();