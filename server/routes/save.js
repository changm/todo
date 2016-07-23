var express = require('express');
var router = express.Router();
var sql = require('pg');
var url = require('url');
var globalConnection;
var assert = require('assert');
var now = require('performance-now');

function connectToDatabase() {
  var client = new sql.Client({
    user: 'todo',
    password: 'todo',
    database: 'todo',
    host: 'localhost',
    port: 5432
  });

  client.connect(function(err) {
    if (err) throw err;
    console.log("Connected successfully");
    globalConnection = client;
  });
}

connectToDatabase();

function deleteItems(aClient, aRes, aDeleted, aCallback) {
  for (var i = 0; i < aDeleted.length; i++) {
    var key = aDeleted[i];
    var sqlQuery = "DELETE FROM todo WHERE id = " + key + ";";
    var deleteQuery = aClient.query(sqlQuery, function(err, results) {
      if (err) console.log(err.message);
      if (aCallback) aCallback();
      return;
    }); // end select;
  }
}

// All the values belong come in array format [ {id : value} ]
function addItems(aClient, aRes, aNewItems, aCallback) {
  for (var i = 0; i < aNewItems.length; i++) {
    // This is particularly ugly :/
    var item = aNewItems[i];
    var key = Object.keys(item)[0];
    var value = item[key];

    var sqlQuery = "INSERT INTO todo VALUES (" + key + ", '" + value + "');";
    var insert = aClient.query(sqlQuery, function(err, results) {
      if (err) console.log(err.message);
      if (aCallback) aCallback();
      return;
    }); // end select;
  }
}

function editItems(aClient, aRes, aEditedItems, aCallback) {
  for (var i = 0; i < aEditedItems.length; i++) {
    // This is particularly ugly :/
    var item = aEditedItems[i];
    var key = Object.keys(item)[0];
    var value = item[key];

    var sqlQuery = "UPDATE todo SET note = '" + value + "' WHERE id = " + key + ";";
    var editQuery = aClient.query(sqlQuery, function(err, results) {
      if (err) console.log(err.message);
      if (aCallback) aCallback();
      return;
    }); // end select;
  }
}

function getAllRows(aClient, aRes, arg) {
  var selectAll = aClient.query("SELECT * FROM todo", function(err, results) {
    if (err) console.log(err.message);
    aRes.send(results.rows);
    return;
  }); // end select;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  getAllRows(globalConnection, res);
});

// Data comes in deleted, new items, edited items
router.get('/update', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var data = query[''];
  data = JSON.parse(data).data;

  var deleted = data[0];
  var newItems = data[1];
  var edited = data[2];

  console.log("Connection is: " + globalConnection);
  deleteItems(globalConnection, res, deleted);
  addItems(globalConnection, res, newItems);
  editItems(globalConnection, res, edited);

  res.send("update all the things");
});

var TEST_DATA_ID = 1;
var TEST_DATA_ENTRY = "test data";
var TEST_EDIT_ENTRY = "edit data";

function getTestData(aId, aValue) {
  var testData = "{ \"" + aId + "\" : \"" + aValue + "\" }";
  var newData = [ JSON.parse(testData) ];
  return newData;
}

router.get('/benchmark', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  var runBenchmark = function() {
    var iteration = 0;
    var runCount = 10000;
    var start = now();
    var iterate = function() {
      var testData = getTestData(iteration, TEST_DATA_ENTRY);
      iteration++;

      if (iteration == runCount) {
        var timing = now() - start;
        res.send("Benchmark took: " + timing + "ms for " + runCount + " insertions");
        testDeleteDatabase(globalConnection);
        return;
      }

      addItems(globalConnection, res, testData, iterate);
    }

    iterate();
  }

  testDeleteDatabase(globalConnection, runBenchmark);
});

function testInsertData(aClient, aPipeline) {
  console.log("Test inserting data");
  // Should be a way to just directly create json with variables :/
  addItems(aClient, undefined, getTestData(TEST_DATA_ID, TEST_DATA_ENTRY), aPipeline);
}

function testVerifyInsert(aClient, aPipeline) {
  console.log("Verifying insert");
  var selectAll = aClient.query("SELECT * FROM todo", function(err, results) {
    if (err) console.log(err.message);
    var id = results.rows[0].id;
    var value = results.rows[0].note;

    if ((id != TEST_DATA_ID) || (TEST_DATA_ENTRY != value)) {
      throw new Error("Invalid insertion");
    }

    console.log("SUCCESS: INSERT DATA");
    aPipeline();
  });
}

function testVerifyDelete(aClient, aPipeline) {
  console.log("Verifying delete");
  var selectAll = aClient.query("SELECT * FROM todo", function(err, results) {
    if (err) console.log(err.message);
    if ((results.rowCount!= 0)) {
      throw new Error("Did not delete data");
    }

    console.log("SUCCESS: DELETE DATA");
    aPipeline();
  });
}

function testVerifyEdit(aClient, aPipeline) {
  console.log("Verifying edit");
  var selectAll = aClient.query("SELECT * FROM todo", function(err, results) {
    if (err) console.log(err.message);
    var id = results.rows[0].id;
    var value = results.rows[0].note;

    if ((id != TEST_DATA_ID) || (TEST_EDIT_ENTRY != value)) {
      throw new Error("Invalid insertion");
    }

    console.log("SUCCESS: EDIT DATA");
    aPipeline();
  });
}

function testDeleteData(aClient, aPipeline) {
  console.log("Test delete data");
  var deleteData = [TEST_DATA_ID];
  deleteItems(aClient, undefined, deleteData, aPipeline);
}

function testEditData(aClient, aPipeline) {
  console.log("Test edit data");
  var editData = getTestData(TEST_DATA_ID, TEST_EDIT_ENTRY);
  editItems(aClient, undefined, editData, aPipeline);
}

function testDeleteDatabase(aClient, aPipeline) {
  console.log("Deleting database for fresh start " + aClient);
  var sqlQuery = "DELETE FROM todo;";
  aClient.query(sqlQuery, function(err, results) {
    if (err) console.log(err.message);
    if (aPipeline) aPipeline();
  });
}

var testPipeline = [];
function executeNext() {
  if (testPipeline.length == 0) return;
  testPipeline.pop()(globalConnection, executeNext);
}

router.get('/test', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log("Testing server side things");

  testPipeline = [ testVerifyEdit,
                   testEditData,
                   testVerifyInsert,
                   testInsertData,
                   testVerifyDelete,
                   testDeleteData,
                   testVerifyInsert,
                   testInsertData,
                   testDeleteDatabase ];

  executeNext();
  res.send("Read console for test results");
});

module.exports = router;
