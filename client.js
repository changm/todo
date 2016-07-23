"use strict";

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

function appendTodoItem() {
  var todoText = document.getElementById("newTodoItem").value;

  // Each todo item consists of a label, edit, and a delete button
  var newItem = document.createElement("div");
  newItem.className = "row";

  var name = document.createElement("div");
  name.className = "column";
  name.innerHTML = todoText;

  var editLabel = document.createElement("div");
  editLabel.className = "column";
  editLabel.appendChild(createButton("Edit"));


  var deleteLabel = document.createElement("div");
  deleteLabel.className = "column";
  deleteLabel.appendChild(createButton("Delete"));

  newItem.appendChild(name);
  newItem.appendChild(editLabel);
  newItem.appendChild(deleteLabel);

  var listArea = document.getElementById("list");
  listArea.appendChild(newItem);
}

function displayTodoItems() {
  var listArea = document.getElementById("list");
}

function attachEvents() {
  listenToAddButton();
  displayTodoItems();
  appendTodoItem();
}

window.onload = attachEvents;
