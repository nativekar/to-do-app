const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "todos"
});

const app = express();
app.use(bodyparser.json());

/* All Todo Bucket Queries begin here */

// query call to fetch all buckets in the Todo
app.get("/", function(req, res) {
  connection.query(
    "select td.id, td.name, td.isdone, td.isnew, tl.id as tasklistid, tl.name as todolistname from todo td right join todolist tl on td.tasklistid = tl.id",
    function(error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// query call to save a new bucket
app.post("/saveTodoList", function(req, res) {
  const newList = {
    name: req.body.name
  };
  connection.query("INSERT INTO todolist SET ?", newList, function(
    error,
    results
  ) {
    if (error) throw error;
    res.send(results);
  });
});

// query call to update a bucket
app.post("/updateTodoList", function(req, res) {
  const newList = {
    name: req.body.name,
    id: req.body.id
  };
  connection.query(
    "UPDATE todolist SET name = ? Where id = ?",
    newList,
    function(error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// query call to delete a bucket
app.post("/deleteTodoList", function(req, res) {
  const newList = {
    name: req.body.name,
    id: req.body.id
  };
  connection.query(
    "DELETE FROM todolist WHERE id = ?",
    newList.id,
    newList.name,
    function(error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

//query call to get names for all buckets for suggestionsList
app.get("/nameSuggestions", function(req, res) {
  connection.query("select tl.name as tasklistname todolist", function(
    error,
    results
  ) {
    if (error) throw error;
    res.send(results);
  });
});

/* All Todo Bucket Queries end here */

/* All Todo Queries begin here*/

//query call to fetch todos for all buckets
app.get("/", function(req, res) {
  connection.query(
    "select td.id, td.name, td.isdone, td.isnew, tl.id as tasklistid, tl.name as todolistname from todo td right join todolist tl on td.tasklistid = tl.id",
    function(error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

/* All Todo Queries end here*/

app.listen(8000, () => {
  console.log("Go to http://localhost:8000/ to see posts");
});
