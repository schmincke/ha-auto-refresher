// HA AUTO REFRESHER: HOME ASSISTANT IPAD MODE REFRESHER
//
// Author: Simon Schmincke - Copy and use however you want
//
// This script lets you go back to /home/ (or any other view) after a set period of time
// When your kids change the view on your Home Assistant on the Wall: This will fix it after some time ;)

const LOG_PREFIX = 'HA AUTO REFRESHER V1.3';
const REFRESH_TIME = 600000; // Go Back to /home/ after 10 minutes
const CHECK_INTERVAL = 60000; // Check for change of HELPER Variable every: 1 minute
const refreshEntityId = 'input_boolean.refresh'; // Entity ID in Home Assistant for the refresh boolean -> Create Helper -> Toggle > "refresh" as name
const token = '<INTPUT YOUR HA API TOKEN HERE>'; // Replace with your actual token Created in Home Assistant Profile > Securite > Create Token (then paste in here)

async function getRefreshState() {
    const response = await fetch('/api/states/' + refreshEntityId, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.state === 'on'; // Assuming 'on' means true for boolean
}

async function initialize() {
    let shouldRefresh = await getRefreshState();
    console.log(`%c${LOG_PREFIX}: %cReload script loaded now V1.1. Refresh mode is currently ${shouldRefresh ? 'ON' : 'OFF'}.`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
    
    async function checkAndUpdate() {
        shouldRefresh = await getRefreshState();
        console.log(`%c${LOG_PREFIX}: %cPeriodic Status Check: Refresh mode is currently ${shouldRefresh ? 'ON' : 'OFF'}. Will check again in ${CHECK_INTERVAL / 1000} seconds.`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
    }

    setInterval(checkAndUpdate, CHECK_INTERVAL);

    function reset_timer(e) {
        if (!shouldRefresh) return;
        const remainingTime = (REFRESH_TIME - (Date.now() % REFRESH_TIME)) / 1000; // Calculate remaining time in seconds
        console.log(`%c${LOG_PREFIX}: %cNOW: RESETTING TIMER DUE TO EVENT: ${e.type} after ${remainingTime.toFixed(0)} seconds`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
        clearTimeout(my_timer);
        my_timer = setTimeout(TimeOut, REFRESH_TIME);
        console.log(`%c${LOG_PREFIX}: %cCurrent REFRESH_TIME is ${REFRESH_TIME / 1000} seconds. Refresh mode is currently ${shouldRefresh ? 'ON' : 'OFF'}.`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
    }

    function TimeOut() {
        if (!shouldRefresh) return;
        console.log(`%c${LOG_PREFIX}: %cTIMEOUT OCCURRED`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
        window.location.href = "http://192.168.1.200:8123/ui-lovelace-minimalist/home"; // URL to your home dashboard or wherever
    }

    if (shouldRefresh) {
        document.addEventListener("click", reset_timer.bind(this));
        document.addEventListener("touchstart", reset_timer.bind(this));
        document.addEventListener("touchmove", reset_timer.bind(this));
        var my_timer = setTimeout(TimeOut.bind(this), REFRESH_TIME);
    }

    console.log(`%c${LOG_PREFIX}: %cInitialize complete. Refresh mode is currently ${shouldRefresh ? 'ON' : 'OFF'}.`, 'background: white; color: black; font-weight: bold;', 'background: red; color: white; font-weight: bold;');
}

initialize();
