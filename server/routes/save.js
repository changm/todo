var express = require('express');
var router = express.Router();
var sql = require('pg');

function connectToDB() {
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

      console.log(results.rows[0]);
    }); // end select; 
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  connectToDB();

  // Disable cors for now
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send('did some things');
});

module.exports = router;
