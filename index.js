const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
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
      // content_image: JSON.stringify(imagen[0][0]),
      content_image: "-",
      image_base64: imagen[0][0].base64,
      image_extension: imagen[0][0].extension,
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

    const imagenData_ = {};
    if (imagen.length > 0) {
      imagenData_ = {
        image_base64: imagen[0][0].base64,
        image_extension: imagen[0][0].extension,
      };
    }

    const data = {
      title: titulo,
      language: lenguaje,
      name_page: type,
      name_section: visualizacionHome,
      content_html: contenido,
      // content_image: JSON.stringify(imagen[0][0]),
      content_image: "-",
      markMain: marcarPrincipal,
      ...imagenData_,
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

    fs.writeFile("error.txt", error, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

    res.json({ codigo: "0", message: "error", error: JSON.stringify(error) });
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
