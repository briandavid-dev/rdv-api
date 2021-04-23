const express = require("express");
const app = express();
const cors = require("cors");
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
app.use(express.json());

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
