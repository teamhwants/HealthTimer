/*
|     Author  : Hwan Kim
|     Created : 05/12/2017
|     Project : Health Timer
*/
/*Emum*/
var ACTION_TIMER_TYPE = {
  HOUR: {
    value: 0,
    name: "hour"
  },
  MINUTE: {
    value: 1,
    name: "min"
  },
  SECOND: {
    value: 2,
    name: "sec"
  }
};
/*
 * class TimerAction, this will be data object for health timer.
 * defulat constructor.
 */
function TimerAction( /*string*/ _action,
  /*int*/
  _interval,
  /*int*/
  _howMany,
  /*ACTION_TIMER_TYPE*/
  _actionTimerType) {
  this.action = _action;
  this.id;
  this.interval = _interval;
  this.howMany = _howMany;
  this.doneAt = null;
  this.timerStarted = null;
  this.timerType = _actionTimerType
  this.created = new Date();
}

function getTimeAction( /*object*/ _action) {
	var newTimeAction = new TimerAction(_action.action, _action.interval, _action.howMany, _action.timerType);
  newTimeAction.id = _action.id;
  if (_action.doneAt)
    newTimeAction.doneAt = new Date(_action.doneAt);
  newTimeAction.timerStarted = _action.timerStarted;
  newTimeAction.timerType = _action.timerType
  if (_action.created)
    newTimeAction.created = new Date(_action.created);
	return newTimeAction;
}

/*Cloning.*/
TimerAction.prototype.copy = function() {
  var cloned = new TimerAction(this.action, this.interval, this.howMany, this.timerType);
  cloned.doneAt = this.doneAt;
  cloned.timerStarted = this.timerStarted;
  return cloned;
}
/*Action start / End*/
TimerAction.prototype.start = function() {
  this.timerStarted = new Date().getTime();
}

TimerAction.prototype.complete = function() {
  this.doneAt = new Date();
  this.start();
}
/*Time Calculation.*/
TimerAction.prototype.getBetween = function( /*ACTION_TIMER_TYPE*/ timerType) {
  var distance = new Date().getTime() - this.timerStarted;
  if (timerType == ACTION_TIMER_TYPE.HOUR) {
    return parseInt((distance / (1000 * 60 * 60)) % 24);
  } else if (timerType == ACTION_TIMER_TYPE.MINUTE) {
    return parseInt((distance / (1000 * 60)) % 60);
  } else {
    return parseInt((distance / 1000));
  }
}
TimerAction.prototype.timeout = function() {
  if (timerType == ACTION_TIMER_TYPE.HOUR) {
    return this.intervalSec * 1000 * 60 * 60 / 2;
  } else if (timerType == ACTION_TIMER_TYPE.MINUTE) {
    return this.intervalSec * 1000 * 60 / 2;
  } else {
    return this.intervalSec * 1000 / 2;
  }
}
/*Get descriptions*/
TimerAction.prototype.getTimerDesc = function() {
  return "Every " + currentAction.interval + " " + this.timerType.name;
}

TimerAction.prototype.getNotificationActionMsg = function() {
  return "Time for " + this.howMany + " " + this.action;
}

TimerAction.prototype.getCompletedActionMsg = function() {
  return "Completed " + this.howMany + " " + this.action;
}