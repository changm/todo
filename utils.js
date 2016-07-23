var GLOBALID = 0;
var TODO_ID_PREFIX = "ROW_ID"
var GLOBAL_LIST_ID = "list";
var EDIT_ID_PREFIX = "EDIT";
var EDIT_LABEL_POSTFIX = "LABEL"

function getEditId(aNumId) {
  return EDIT_ID_PREFIX + aNumId;
}

function getEditLabelId(aNumId) {
  return getEditId(aNumId) + EDIT_LABEL_POSTFIX;
}

function getTodoRowParentId(aNumId) {
  return TODO_ID_PREFIX + aNumId;
}
