const express = require("express");
const app = express();
const cors = require("cors");

var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "51.161.116.237",
  user: "bmosoluc_rdv_user",
  password: "RDVrdv..1324",
  database: "bmosoluc_rdv_web_cms",
});

app.use(cors());

app.get("/api1/", (req, res) => {
  pool.query("SELECT * FROM post LIMIT 10", function (error, results, fields) {
    if (error) throw error;
    res.json({ codigo: "1", results });
  });
});

app.get("/api1/bb", (req, res) => {
  res.json({ codigo: "2" });
});

app.get("/api1/cc", (req, res) => {
  res.json({ codigo: "cc" });
});

app.get("/api1/dd", (req, res) => {
  res.json({ codigo: "golgo" });
});

// Default port: 8080
app.listen(5000, () => {
  console.log("Server 5000");
});
