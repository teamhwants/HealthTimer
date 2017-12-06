var actionEventTemplate;

function addCompletedAction( /*TimerAction*/ completedAction) {
  /*Get template.*/
  if (!actionEventTemplate) {
    actionEventTemplate = $('#hidden-template').html();
  }

  //TODO: 1. Add information to summary view.
  var item = $(actionEventTemplate).clone();
  $(item).find('#idDesc').html(completedAction.getCompletedActionMsg());
  $(item).find('#actionOccured').html(completedAction.doneAt.toLocaleTimeString());
  $('#eventView').append(item);

  //TODO: 2. Save the data into File.
}

function actionSkipped( /*TimerAction*/ skippedAction) {

}