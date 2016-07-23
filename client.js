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

function appendTodoItem(aId, aItem) {
  var todoText = aItem;
  if (todoText == undefined) {
    var todoText = document.getElementById("newTodoItem").value; 
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
  //newItem.id = TODO_ID_PREFIX + GLOBALID++;
  newItem.id = aId;

  var name = document.createElement("div");
  name.className = "column";
  //name.innerHTML = todoText;
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

function displayTodoItems(todoItems) {
  var listArea = document.getElementById("list");

  appendTodoItem(1, "testing");

  /*
  var obj = JSON.parse(listArea);
  alert(obj);


  var id = firstItem[0];
  var item = firstItem[1];
  appendTodoItem(id, item);

  /*
  for (var todoItem in todoItems) {
    var id = todoItem[0];
    var item = todoItem[1];
    appendTodoItem(id, item);
  }
  */
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
