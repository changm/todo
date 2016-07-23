var express = require('express');
var router = express.Router();
var sql = require('pg');
var url = require('url');

function getAllRows(res) {
  var client = new sql.Client({
    user: 'todo',
    password: 'todo',
    database: 'todo',
    host: 'localhost',
    port: 5432
  });

  client.connect(function(err) {
    if (err) throw err;

    console.log("Connection success");

    var selectAll = client.query("SELECT * FROM todo", function(err, results) {
      if (err) console.log(err.message);
      res.send(results.rows);
    }); // end select;
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  getAllRows(res);
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

  console.log(newItems);

  res.send("update all the things");
});


module.exports = router;
