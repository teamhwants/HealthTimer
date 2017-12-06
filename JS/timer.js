/*
|     Author  : Hwan Kim
|     Created : 05/12/2017
|     Project : Health Timer
*/
var on = false;
var startedTime = null;
var timerId;
var currentAction;
var timerType = ACTION_TIMER_TYPE.SECOND;

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
    var duration = currentAction.getBetween(currentAction.timerType)
    if (duration >= currentAction.interval && !onNotificationShow) {
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
function loadTimerAction() {
  //TODO: add load function.
  return new TimerAction("push up", 10, 10, timerType);
}

function saveTimerAction() {
  //TODO: add save function.
}

/*String util*/
function getTimerString() {
  var seconds = currentAction.getBetween(ACTION_TIMER_TYPE.SECOND),
    minutes = currentAction.getBetween(ACTION_TIMER_TYPE.MINUTE),
    hours = currentAction.getBetween(ACTION_TIMER_TYPE.HOUR);

  hours = leftPad(hours, 2);
  hours = ((hours > 0) ? hours + "h " : "");
  minutes = leftPad(minutes, 2);
  seconds = leftPad(seconds, 2);
  return hours + minutes + ":" + seconds;
}

function leftPad(number, targetLength) {
  return ("0" + number).slice(-targetLength);
}