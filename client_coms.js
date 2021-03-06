"use strict";
// Sends out requests to localhost
var HOST = "http://localhost:3000/";

function readAllItems(data) {
  alert(data.responseText);
}

function readAllItems(callback) {
  var getAllItems = new XMLHttpRequest();
  getAllItems.open("GET", HOST + "save");
  getAllItems.onreadystatechange = function() {
    if (getAllItems.readyState == XMLHttpRequest.DONE) {
      callback(getAllItems.responseText);
    }
  }

  getAllItems.send();
}

// Expected format to be in JSON already
function updateData(aDeleted, aNewItems, aEditedItems, aCallback) {
  var updateRequest = new XMLHttpRequest();

  var newData = {"data" : [aDeleted, aNewItems, aEditedItems] };
  newData = encodeURIComponent(JSON.stringify(newData));

  updateRequest.open("GET", HOST + "save/update?=" + newData);

  updateRequest.onreadystatechange = function() {
    if (updateRequest.readyState == XMLHttpRequest.DONE) {
      aCallback();
    }
  }

  //var updateData = {"data" : [aDeleted, aNewItems, aEditedItems] };
  updateRequest.send();
}
