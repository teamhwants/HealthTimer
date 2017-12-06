/*
|     Author  : Hwan Kim
|     Created : 05/12/2017
|     Project : Health Timer
*/
var defaultActionLocation = "healthTimer.action.default";
var completedActionLocation = "healthTimer.action.compeleted";
var on = false;
var currentAction;
var loadDefaultFromStorage = false;
/*Default Action values*/
var interval = 1;
var actionSet = 10;
var timerType = ACTION_TIMER_TYPE.HOUR;
var actionName = "push ups";

/*Init*/
$(document).ready(function() {
  init();
});

function init() {
  currentAction = loadTimerAction();
  setInterval(updateCurrentTime, 1000);
  $("#toggleTimerBtn").click(function() {
    toggleTimer();
  });
  updateTimerIntervalLable();
}

/*Button click*/
function toggleTimer() {
  on = !on;
  console.log(">>>toggleTimer(" + on + ")");
  document.getElementById("toggleTimerBtn").innerHTML = on ? "Stop" : "Start";
  if (on) {
    currentAction.start();
    currentAction.id = setInterval(updateTimer, 500);
  } else {
    clearInterval(currentAction.id);
    document.getElementById("timer").innerHTML = "00:00";
  }
}

/*Update methods*/
function updateTimer() {
  if (on) {
    document.getElementById("timer").innerHTML = getTimerString();
   
    if (currentAction.isDue() && !onNotificationShow) {
      notifyMe();
    }
  }
}

function updateTimerIntervalLable() {
  document.getElementById("timerInterval").innerHTML =
    currentAction.getTimerDesc();
}

function updateCurrentTime() {
  document.getElementById("currentTime").innerHTML =
    new Date().toLocaleTimeString();
}

/* OS Notification */
var onNotificationShow = false;

function notifyMe() {
  console.log("it is the time boys!!! SPRATAAAA!!");
  onNotificationShow = true;
  document.getElementById('notificationSound').play();
  currentAction.complete(); //will reset started time.
  $.tinyNotice({
    statusTitle: "Health Timer Action", // notification title
    statusText: currentAction.getNotificationActionMsg(), // notification message
    status: "note", // info, note, warning, error, success, and default
    lifeTime: currentAction.timeout(), // timeout for an action
    setConfirm: ["Ok,i'm done!", "Skip this time.."],
    accept: function() {
      onNotificationShow = false;
      addCompletedAction(currentAction.copy());
    },
    cancel: function() {
      onNotificationShow = false;
      actionSkipped(currentAction.copy());
    }, // skipped.
    callback: function() {
      onNotificationShow = false;
      actionSkipped(currentAction.copy());
    } // timeout skipped..
  });
}

/*File IO*/

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function loadTimerAction() {
  console.log(">>>loadTimerAction()");

  /* 1. Check html 5 local storage is avaible.*/
  if (!supports_html5_storage()) {
    console.log("FAIL!! not supports_html5_storage");
    return new TimerAction(actionName, interval, actionSet, timerType);
  }

  /* 2. Try to get default action*/
  var defaultAction = loadDefaultFromStorage? localStorage.getObject(defaultActionLocation) : null;
  if (!defaultAction) {
    console.log("Found no default action");
    defaultAction = new TimerAction(actionName, interval, actionSet, timerType);
    localStorage.setObject(defaultAction, defaultActionLocation);
  } else {
    defaultAction = getTimeAction(defaultAction);
	if(defaultAction.created)
		console.log("Found default action created at " + defaultAction.created.toLocaleTimeString());
  }

  /* 3. Load saved comepleted action history.*/
  var savedCompeletedActions = localStorage.getObject(completedActionLocation);
  if (savedCompeletedActions) {
    console.log("Found compeleted timer actions");
    setCompletedActions(savedCompeletedActions);
  } else {
    console.log("No compeleted timer action found");
  }

  return defaultAction;
}

function saveTimerAction( /*TimerAction*/ completedAction) {
  console.log(">>>saveTimerAction()");
  if (!supports_html5_storage()) {
    return false;
  }
  getCompletedActions().push(completedAction);
  localStorage.setObject(getCompletedActions(), completedActionLocation);
  return true;
}


Storage.prototype.setObject = function(value, key) {
  console.log(">>>setObject(" + key + ")");
  this.setItem(key, JSON.stringify(value));
  console.log("<<<setObject(" + key + ")");
}

Storage.prototype.getObject = function(key) {
  console.log(">>>getObject(" + key + ")");
  var value = this.getItem(key);
  console.log("<<<getObject(" + value + ")");
  value = value && JSON.parse(value);
  console.log("<<<getObject(" + value + ")");
  return value;
}

/*String util*/
function getTimerString() {
	var duration = new Date().getTime() - currentAction.timerStarted;
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

	if(hours > 0)
	{
		hours = (hours < 10) ? "0" + hours : hours;
		hours += ":"
	}
	else
	{
		hours = "";
	}
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
	return hours + minutes + ":" + seconds;
}

function leftPad(number, targetLength) {
  return ("0" + number).slice(-targetLength);
}