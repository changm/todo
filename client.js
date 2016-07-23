"use strict";

var GLOBALID = 0;
var TODO_ID_PREFIX = "ROW_ID"

function listenToAddButton() {
  var button = document.getElementById("addTodo");
  button.onclick = appendTodoItem;
}

// Returns a button with a label and will call aOnclickEvent when clicked.
function createButton(aLabel, aOnclickEvent) {
  var button = document.createElement("button");
  button.className = "ui button";
  button.onclick = aOnclickEvent;
  button.innerHTML = aLabel;
  return button;
}

function editItem() {
  alert("Deleting item");
}

function deleteItem() {
  alert("Deleting item");
}

function appendTodoItem() {
  var todoText = document.getElementById("newTodoItem").value;

  // Each todo item consists of a label, edit, and a delete button
  // Create: semantic:
  // <div class="row">
  // <div class="column"></div>
  // <div class="column"></div>
  // <div class="column"></div>
  // </div>
  var newItem = document.createElement("div");
  newItem.className = "row";
  newItem.id = TODO_ID_PREFIX + GLOBALID++;

  var name = document.createElement("div");
  name.className = "column";
  name.innerHTML = todoText;

  var editLabel = document.createElement("div");
  editLabel.className = "column";
  editLabel.appendChild(createButton("Edit", editItem));

  var deleteLabel = document.createElement("div");
  deleteLabel.className = "column";
  deleteLabel.appendChild(createButton("Delete", deleteItem));

  newItem.appendChild(name);
  newItem.appendChild(editLabel);
  newItem.appendChild(deleteLabel);

  var listArea = document.getElementById("list");
  listArea.appendChild(newItem);
}

function displayTodoItems() {
  var listArea = document.getElementById("list");
  sendRequest();
}

function clearState() {
  // Semantic likes to keep text in the input field on refresh, so reload
  var addItemSearch = document.getElementById("newTodoItem");
  addItemSearch.value = "";
}

function attachEvents() {
  clearState();
  listenToAddButton();
  displayTodoItems();
}

window.onload = attachEvents;
