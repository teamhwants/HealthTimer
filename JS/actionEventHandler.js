/*
|     Author  : Hwan Kim
|     Created : 05/12/2017
|     Project : Health Timer
*/
var actionEventTemplate;
var completedActions = [];

function getCompletedActions() {
  return completedActions;
}

Date.prototype.isSameDateAs = function(pDate) {
  if (!pDate)
    return false;
  var isIt = false;
  isIt = (
    this.getFullYear() === pDate.getFullYear() &&
    this.getMonth() === pDate.getMonth() &&
    this.getDate() === pDate.getDate()
  );
  console.log("isSameDateAs(" + this + "," + pDate + ") " + isIt);
  return isIt;
}

function setCompletedActions( /*array*/ actions) {
  completedActions = actions;
  var groups = actions.reduce(function(r, action) {
    var date = action.doneAt.split(('T'))[0];
    //Group by date and action.
    var groupKey = date + "(" + action.action + ")";
    (r[groupKey]) ? r[groupKey].data.push(action): r[groupKey] = {
      group: groupKey,
      data: [getTimeAction(action)]
    };
    return r;
  }, {});

  var result = Object.keys(groups).map(function(k) {
    return groups[k];
  });

  result.forEach(function(group) {
    var dateAndAction = group.group;
    var total = 0;
    group.data.forEach(function(action) {
      total += action.howMany;
    });

    /*Get template.*/
    if (!actionEventTemplate) {
      actionEventTemplate = $('#hidden-template').html();
    }

    var item = $(actionEventTemplate).clone();
    $(item).find('#idDesc').html(dateAndAction);
    $(item).find('#actionOccured').html(total);
    $('#eventView').append(item);
  });
}

function addCompletedAction( /*TimerAction*/ completedAction) {
  completedActions.push(completedAction);
  //TODO: 1. Add information to summary view.
  populateToView(completedAction);
  //TODO: 2. Save the data into File.
  saveTimerAction(completedAction);
}

function populateToView( /*TimerAction*/ action) {
  /*Get template.*/
  if (!actionEventTemplate) {
    actionEventTemplate = $('#hidden-template').html();
  }

  var item = $(actionEventTemplate).clone();
  $(item).find('#idDesc').html(action.getCompletedActionMsg());
  $(item).find('#actionOccured').html(action.doneAt);
  $('#eventView').append(item);
}

function actionSkipped( /*TimerAction*/ skippedAction) {

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