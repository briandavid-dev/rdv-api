const express = require("express");
const app = express();
const cors = require("cors");
const moment = require("moment");
const port = 5000;

var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "51.161.116.237",
  user: "bmosoluc_rdv_user",
  password: "RDVrdv..1324",
  database: "bmosoluc_rdv_web_cms",
});

app.use(cors());
// app.use(express.json());
// app.use(express.bodyParser({ limit: "50mb" }));

app.use(express.json({ limit: "50mb" }));

app.get("/api-rdv/contenido/", (req, res) => {
  pool.query(
    "SELECT * FROM posts LIMIT 100",
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    }
  );
});

app.post("/api-rdv/contenido/", (req, res) => {
  try {
    const {
      titulo,
      type,
      visualizacionHome,
      marcarPrincipal,
      contenido,
      imagen,
      lenguaje,
    } = req.body;

    const data = {
      title: titulo,
      language: lenguaje,
      name_page: type,
      name_section: visualizacionHome,
      content_html: contenido,
      content_image: JSON.stringify(imagen[0][0]),
      content_base64: imagen[0][0].base64,
      content_extension: imagen[0][0]).extension,
      markMain: marcarPrincipal,
    };

    pool.query(
      "INSERT INTO posts SET ?",
      data,
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    // console.log(`error`, error); // hacer log y enviarlo alli
    res.json({ codigo: "0", message: "error" });
  }
});

app.put("/api-rdv/contenido/", (req, res) => {
  try {
    const {
      id,
      titulo,
      type,
      visualizacionHome,
      marcarPrincipal,
      contenido,
      imagen,
      lenguaje,
    } = req.body;

    const data = {
      title: titulo,
      language: lenguaje,
      name_page: type,
      name_section: visualizacionHome,
      content_html: contenido,
      content_image: JSON.stringify(imagen[0][0]),
      markMain: marcarPrincipal,
    };

    pool.query(
      "UPDATE posts SET ? WHERE id = ?",
      [data, id],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    // console.log(`error`, error); // hacer log y enviarlo alli
    res.json({ codigo: "0", message: "error" });
  }
});

app.delete("/api-rdv/contenido", (req, res) => {
  try {
    const { id } = req.body;
    pool.query(
      "DELETE FROM posts WHERE id = ?",
      id,
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    // log
    res.json({ codigo: "0", message: "error" });
  }
});

app.listen(port, () => {
  console.log("Server " + port);
});

// var startDate = new Date(2013, 1, 12),
//   endDate = new Date(2013, 1, 15),
//   date = new Date(2013, 2, 15),
//   range = moment().range(startDate, endDate);

// range.contains(date);

// console.log(
//   `moment().range('2021-04-23 00:00:00', '2021-04-24 00:00:00')`,
//   moment()
// );

var now = moment();
var compareDate = moment("23/04/2021 12:21", "DD/MM/YYYY hh:mm:ss");
var startDate = moment("23/04/2021 12:20", "DD/MM/YYYY hh:mm:ss");
var endDate = moment("23/04/2021 12:22", "DD/MM/YYYY hh:mm:ss");

console.log(`now`, now);
console.log(`compareDate`, compareDate);
console.log(`startDate`, startDate);
console.log(`endDate`, endDate);

console.log(now.isBetween(startDate, endDate));
