"use strict";

var GLOBAL_ID = 0;
var ALL_NEW = [];
var ALL_DELETES = [];
var ALL_EDITED = [];

function savedData() {
  alert("Saved all the data");
}

function updateServer() {
  updateData(ALL_DELETES, ALL_NEW, ALL_EDITED, savedData);

  ALL_NEW = [];
  ALL_DELETES = [];
  ALL_EDITED = [];
}

function listenToAddButton() {
  var addButton = document.getElementById("addTodo");
  addButton.onclick = appendTodoItem;

  var saveButton = document.getElementById("save");
  saveButton.onclick = updateServer;

  var testButton = document.getElementById("test");
  testButton.onclick = runTests;
}

function getNumOfItems() {
  var listArea = document.getElementById(GLOBAL_LIST_ID);
  return listArea.childNodes.length;
}

function assert(condition, msg) {
  if (!condition) {
    alert(msg);
  }
}

function clearItems() {
  var listArea = document.getElementById(GLOBAL_LIST_ID);
  while (listArea.firstChild) {
    listArea.removeChild(listArea.firstChild);
  }

  ALL_NEW = [];
  ALL_DELETES = [];
  ALL_EDITED = [];
  cleanDuplicateChecker();
}

function runTests() {
  var testId = 1;
  var testData = "test data";
  clearItems();

  appendTodoItem(testId, testData);
  assert(getNumOfItems() == 1, "Could not append todo item");

  var testButton = createButton(testId);
  deleteItem(testButton);
  assert(getNumOfItems() == 0, "Could not delete item");

  appendTodoItem(testId, testData);

  var editButton = editItem(testButton);
  var oldText = getTodoItemText(testId);
  var newText = "new text";
  saveEdit(editButton, oldText, "new text");

  var editedText = getTodoItemText(testId);
  assert(editedText == newText, "Edited text not complete");

  clearItems();
  alert("All tests passed");
}

// Returns a button with a label and will call aOnclickEvent when clicked.
function createButton(aId, aLabel, aOnclickEvent, aArg) {
  var button = document.createElement("button");
  button.className = "ui button";
  button.onclick = function() {
    aOnclickEvent(button, aArg);
  }

  button.innerHTML = aLabel;
  button.id = aId;
  return button;
}

function saveEdit(aButton, aOldText, aTestText) {
  var editId = getTodoListLabelId(aButton.id);
  var editInputLabelId = getEditLabelId(aButton.id);

  var editInputLabel = document.getElementById(editInputLabelId);

  // Hack to just overwrite the label with aTestText
  var currentText = aTestText ? aTestText : editInputLabel.value;
  if (isDuplicate(currentText)) {
    alert("Duplicate text: " + currentText + " choose something else");
    currentText = aOldText;
  }

  var rowParent = document.getElementById(getTodoRowParentId(aButton.id));

  var editIdDiv = document.getElementById(editId);
  editIdDiv.removeChild(aButton);

  editIdDiv.innerHTML = currentText;

  var editData = "{ \"" + aButton.id + "\" : \"" + currentText + "\" }";
  ALL_EDITED.push(JSON.parse(editData));
}

function editItem(aButton) {
  var editId = getTodoListLabelId(aButton.id);
  var editIdDiv = document.getElementById(editId);
  var currentText = editIdDiv.innerHTML;
  var rowParent = document.getElementById(getTodoRowParentId(aButton.id));

  // Hmm, there's probably a JS way to do this rather than looking at the html
  editIdDiv.className = "ui action input column";

  // Make the input
  var editInputLabelId = getEditLabelId(aButton.id);
  editIdDiv.innerHTML = "<input placeholder='" + currentText + "' type='text' id='" + editInputLabelId + "'>"

  var editButton = createButton(aButton.id, "Edit Selection", saveEdit, currentText);
  editIdDiv.appendChild(editButton);
  return editButton;
}

function deleteItem(aButton) {
  var rowText = getTodoItemText(aButton.id);

  var divParentId = getTodoRowParentId(aButton.id);
  var rowParentDiv = document.getElementById(divParentId);
  var listRoot = document.getElementById(GLOBAL_LIST_ID);
  listRoot.removeChild(rowParentDiv);

  ALL_DELETES.push(aButton.id);
  removeFromDuplicateChecker(rowText);
}

function appendTodoItem(aId, aItem) {
  var isNewItem = aItem == undefined;
  var todoText = isNewItem ? document.getElementById("newTodoItem").value : aItem;

  if (isDuplicate(todoText)) {
    alert("Duplicate item");
    return;
  }

  if (isNewItem) {
    aId = ++GLOBAL_ID;
    var newData = "{ \"" + aId + "\" : \"" + todoText + "\" }";
    ALL_NEW.push(JSON.parse(newData));
  }

  // Each todo item consists of a label, edit, and a delete button
  // Create: semantic:
  // <div class="row">
  // <div class="column"></div>
  // <div class="column"></div>
  // <div class="column"></div>
  // </div>
  var newItem = document.createElement("div");
  newItem.className = "row";
  newItem.id = TODO_ID_PREFIX + aId;

  var name = document.createElement("div");
  name.className = "column";
  name.innerHTML = todoText;
  name.id = EDIT_ID_PREFIX + aId;

  var editLabel = document.createElement("div");
  editLabel.className = "column";
  editLabel.appendChild(createButton(aId, "Edit", editItem));

  var deleteLabel = document.createElement("div");
  deleteLabel.className = "column";
  deleteLabel.appendChild(createButton(aId, "Delete", deleteItem));

  newItem.appendChild(name);
  newItem.appendChild(editLabel);
  newItem.appendChild(deleteLabel);

  var listArea = document.getElementById(GLOBAL_LIST_ID);
  listArea.appendChild(newItem);

  addToDuplicateChecker(todoText);
  clearAddButton();
}

function displayTodoItems(todoItems) {
  var listArea = document.getElementById(GLOBAL_LIST_ID);
  if (todoItems.length == 0) {
    return;
  }

  var savedItems = JSON.parse(todoItems);
  var nextId = 0;

  for (var i = 0; i < savedItems.length; i++) {
    var entry = savedItems[i];
    nextId = Math.max(entry.id, nextId);
    appendTodoItem(entry.id, entry.note);
  }

  GLOBAL_ID = nextId;
}

function clearAddButton() {
  // Semantic likes to keep text in the input field on refresh, so reload
  var addItemSearch = document.getElementById("newTodoItem");
  addItemSearch.value = "";
}

function attachEvents() {
  clearAddButton();
  listenToAddButton();
  sendRequest(displayTodoItems);
}

window.onload = attachEvents;
