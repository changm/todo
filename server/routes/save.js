var express = require('express');
var router = express.Router();
var sql = require('pg');

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

module.exports = router;
