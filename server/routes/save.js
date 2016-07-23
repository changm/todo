var express = require('express');
var router = express.Router();
var sql = require('pg');
var url = require('url');

function getConnection(aCallback, aRes, aArg) {
  var client = new sql.Client({
    user: 'todo',
    password: 'todo',
    database: 'todo',
    host: 'localhost',
    port: 5432
  });

  client.connect(function(err) {
    if (err) throw err;

    aCallback(client, aRes, aArg);
  });
}

function deleteItems(aClient, aRes, aDeleted) {
  for (var i = 0; i < aDeleted.length; i++) {
    var key = aDeleted[i];
    console.log(key);

    var sqlQuery = "DELETE FROM todo WHERE id = " + key + ";";
    var deleteQuery = aClient.query(sqlQuery, function(err, results) {
        if (err) console.log(err.message);
        return;
    }); // end select;
  }
}

function addItems(aClient, aRes, aNewItems) {
  for (var i = 0; i < aNewItems.length; i++) {
    // This is particularly ugly :/
    var item = aNewItems[i];
    var key = Object.keys(item)[0];
    var value = item[key];

    var sqlQuery = "INSERT INTO todo VALUES (" + key + ", '" + value + "');";
    var insert = aClient.query(sqlQuery, function(err, results) {
        if (err) console.log(err.message);
        return;
    }); // end select;
  }
}

function editItems(aClient, aRes, aEditedItems) {
  for (var i = 0; i < aEditedItems.length; i++) {
    // This is particularly ugly :/
    var item = aEditedItems[i];
    var key = Object.keys(item)[0];
    var value = item[key];

    var sqlQuery = "UPDATE todo SET note = '" + value + "' WHERE id = " + key + ";";
    var editQuery = aClient.query(sqlQuery, function(err, results) {
        if (err) console.log(err.message);
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
  getConnection(getAllRows, res);
  //getAllRows(res);
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

  getConnection(deleteItems, res, deleted);
  getConnection(addItems, res, newItems);
  getConnection(editItems, res, edited);

  res.send("update all the things");
});


module.exports = router;
