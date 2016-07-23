"use strict";
// Sends out requests to localhost
var HOST = "http://localhost:3000/";

function readAllItems(data) {
  alert(data.responseText);
}

function sendRequest() {
  var getAllItems = new XMLHttpRequest();
  getAllItems.open("GET", HOST + "save");
  getAllItems.onreadystatechange = function() {
    if (getAllItems.readyState == XMLHttpRequest.DONE) {
      alert(getAllItems.responseText);
    }
  }

  getAllItems.send();
}

function recvRequest() {

}

