"use strict";

var GLOBAL_ID = 0;
var ALL_NEW = [];
var ALL_DELETES = [];
var ALL_EDITED = [];

function updateServer() {
  updateData(ALL_DELETES, ALL_NEW, ALL_EDITED);

  ALL_NEW = [];
  //ALL_DELETES = [];
  //ALL_EDITED = [];
}

function listenToAddButton() {
  var addButton = document.getElementById("addTodo");
  addButton.onclick = appendTodoItem;

  var saveButton = document.getElementById("save");
  saveButton.onclick = updateServer;
}

// Returns a button with a label and will call aOnclickEvent when clicked.
function createButton(aId, aLabel, aOnclickEvent) {
  var button = document.createElement("button");
  button.className = "ui button";
  button.onclick = function() {
    aOnclickEvent(button);
  }

  button.innerHTML = aLabel;
  button.id = aId;
  return button;
}

function saveEdit(aButton) {
  var editId = getEditId(aButton.id);
  var editInputLabelId = getEditLabelId(aButton.id);

  var editInputLabel = document.getElementById(editInputLabelId);
  var currentText = editInputLabel.value;

  var rowParent = document.getElementById(getTodoRowParentId(aButton.id));

  var editIdDiv = document.getElementById(editId);
  editIdDiv.removeChild(aButton);

  editIdDiv.innerHTML = currentText;

  var editData = "{ \"" + aButton.id + "\" : \"" + currentText + "\" }";
  ALL_EDITED.push(JSON.parse(editData));
}

function editItem(aButton) {
  var editId = getEditId(aButton.id);
  var editIdDiv = document.getElementById(editId);
  var currentText = editIdDiv.innerHTML;
  var rowParent = document.getElementById(getTodoRowParentId(aButton.id));

  // Make this an input instead
  //var editField = document.createElement("input");
  //editField.setAttribute('type', 'text');

  // Hmm, there's probably a JS way to do this rather than looking at the html
  editIdDiv.className = "ui action input column";

  // Make the input
  var editInputLabelId = getEditLabelId(aButton.id);
  editIdDiv.innerHTML = "<input placeholder='" + currentText + "' type='text' id='" + editInputLabelId + "'>"

  var editButton = createButton(aButton.id, "Edit Selection", saveEdit);
  editIdDiv.appendChild(editButton);
}

function deleteItem(aButton) {
  var divParentId = getTodoRowParentId(aButton.id);
  var rowParentDiv = document.getElementById(divParentId);
  var listRoot = document.getElementById(GLOBAL_LIST_ID);
  listRoot.removeChild(rowParentDiv);

  alert("Deleting id: " + aButton.id);
  ALL_DELETES.push(aButton.id);
}

function appendTodoItem(aId, aItem) {
  var todoText = aItem;
  if (todoText == undefined) {
    var todoText = document.getElementById("newTodoItem").value;
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
}

function displayTodoItems(todoItems) {
  var listArea = document.getElementById(GLOBAL_LIST_ID);
  var savedItems = JSON.parse(todoItems);
  var nextId = 0;

  for (var i = 0; i < savedItems.length; i++) {
    var entry = savedItems[i];
    nextId = Math.max(entry.id, nextId);
    appendTodoItem(entry.id, entry.note);
  }

  GLOBAL_ID = nextId;
}

function clearState() {
  // Semantic likes to keep text in the input field on refresh, so reload
  var addItemSearch = document.getElementById("newTodoItem");
  addItemSearch.value = "";
}

function attachEvents() {
  clearState();
  listenToAddButton();
  sendRequest(displayTodoItems);
}

window.onload = attachEvents;
