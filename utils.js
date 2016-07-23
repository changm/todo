var TODO_ID_PREFIX = "ROW_ID"
var GLOBAL_LIST_ID = "list";
var EDIT_ID_PREFIX = "TODO_LABEL";
var EDIT_LABEL_POSTFIX = "EDIT";

function getTodoListLabelId(aNumId) {
  return EDIT_ID_PREFIX + aNumId;
}

function getEditLabelId(aNumId) {
  return getTodoListLabelId(aNumId) + EDIT_LABEL_POSTFIX;
}

function getTodoRowParentId(aNumId) {
  return TODO_ID_PREFIX + aNumId;
}

function getEditButtonLabel(aNumId) {
  return EDIT_BUTTON_PREFIX + aNumId;
}

function getTodoItemText(aNumId) {
  return document.getElementById(getTodoListLabelId(aNumId)).innerHTML;
}

var ALL_ENTRIES = {};
function isDuplicate(aTodo) {
  return aTodo in ALL_ENTRIES;
}

function addToDuplicateChecker(aTodoText) {
  ALL_ENTRIES[aTodoText] = true;
}

function removeFromDuplicateChecker(aTodoText) {
  delete ALL_ENTRIES[aTodoText];
}

function cleanDuplicateChecker() {
  ALL_ENTRIES = [];
}
