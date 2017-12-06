var actionEventTemplate;
var completedActions = [];

function getCompletedActions() {
  return completedActions;
}

Date.prototype.isSameDateAs = function(pDate) {
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
  var today = new Date();

  completedActions.forEach(function(action) {
    console.log("loading found action :" + action);
    action = new TimerAction(action);
    if (today.isSameDateAs(action.doneAt)) {
      populateToView(action);
    }
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
  $(item).find('#actionOccured').html(action.doneAt.toLocaleTimeString());
  $('#eventView').append(item);
}

function actionSkipped( /*TimerAction*/ skippedAction) {

}