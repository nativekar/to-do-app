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

app.get("/", function(req, res) {
  connection.query(
    "select td.id, td.name, td.isdone, td.isnew, tl.id as tasklistid, tl.name as todolistname from todo td right join todolist tl on td.tasklistid = tl.id",
    function(error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

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

app.listen(8000, () => {
  console.log("Go to http://localhost:8000/ to see posts");
});

// const mysql = require("mysql");

// export const getConnectionObj = () => {
//   const connection = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "root",
//     database: "todos"
//   });
//   connection.connect(err => {
//     if (err) {
//       console.log("Error connecting to Db", err);
//       return;
//     }
//     console.log("Connection established");
//   });
//   return connection;
// };

// export const createBucket = (connection, todoBucket) => {
//   connection.query("INSERT INTO todolist SET ?", todoBucket, (err, res) => {
//     if (err) throw err;

//     console.log("Last insert ID:", res.insertId);
//   });
// };

// export const createTodo = (connection, todo) => {
//   connection.query("INSERT INTO todo SET ?", todo, (err, res) => {
//     if (err) throw err;

//     console.log("Last insert ID:", res.insertId);
//   });
// };

// export const fetchBuckets = connection => {
//   connection.query("SELECT * FROM todolist", (err, rows) => {
//     if (err) throw err;
//     console.log("Data received from Db:\n");
//     console.log(rows);
//   });
// };

// export const fetchTodosByBucket = (connection, bucketId) => {
//   connection.query("SELECT * FROM todo", (err, rows) => {
//     if (err) throw err;
//     console.log("Data received from Db:\n");
//     console.log(rows);
//   });
// };

// export const updateBucket = (connection, todoBucket) => {
//   connection.query(
//     "UPDATE todolist SET name = ? Where id = ?",
//     [todoBucket.name, todoBucket.id],
//     (err, result) => {
//       if (err) throw err;

//       console.log(`Changed ${result.changedRows} row(s)`);
//     }
//   );
// };

// export const deleteBucket = (connection, bucketId) => {
//   connection.query(
//     "DELETE FROM todolist WHERE id = ?",
//     [bucketId],
//     (err, result) => {
//       if (err) throw err;
//       console.log(`Deleted ${result.affectedRows} row(s)`);
//     }
//   );
// };

// export const deleteTodo = (connection, todoID) => {
//   connection.query("DELETE FROM todo WHERE id = ?", [todoID], (err, result) => {
//     if (err) throw err;
//     console.log(`Deleted ${result.affectedRows} row(s)`);
//   });
// };

// export const updateTodo = (connection, todo) => {
//   connection.query(
//     "UPDATE todo SET name = ? Where id = ?",
//     [todo.name, todo.id],
//     (err, result) => {
//       if (err) throw err;
//       console.log(`Changed ${result.changedRows} row(s)`);
//     }
//   );
// };
