const fs = require("fs");
const { pool } = require("../config/database");

module.exports.get = (req, res) => {
  pool.query(
    "SELECT * FROM posts LIMIT 100",
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    }
  );
};

module.exports.post = (req, res) => {
  try {
    const {
      titulo,
      type,
      visualizacionHome,
      marcarPrincipal,
      contenido,
      imagen,
      lenguaje,
      summary,
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
      summary,
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
};

module.exports.update = (req, res) => {
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
      summary,
    } = req.body;

    let imagenData_ = {};
    if (imagen.length > 0) {
      imagenData_ = {
        image_base64: imagen[0][0].base64,
        image_extension: imagen[0][0].extension,
      };
    }

    const data = {
      title: titulo,
      language: lenguaje,
      summary,
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

    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

    res.json({ codigo: "0", message: "error", error: JSON.stringify(error) });
  }
};

module.exports.delete = (req, res) => {
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
};
