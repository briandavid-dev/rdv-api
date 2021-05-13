const fs = require("fs");
const { pool } = require("../config/database");

module.exports.get = (req, res) => {
  const { lang } = req.params;

  pool.query(
    `SELECT * FROM posts WHERE language = '${lang}' AND name_page = 'empresas' LIMIT 100`,
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    }
  );
};

module.exports.getEmpresa = (req, res) => {
  const { id } = req.params;

  pool.query(
    `SELECT * FROM posts WHERE id = '${id}' AND name_page = 'empresas'`,
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", empresa: results[0] });
    }
  );
};

module.exports.insertProducto = (req, res) => {
  try {
    const {
      name,
      image_extension,
      image_base64,
      language,
      empresa_id,
      content_html,
      type,
    } = req.body;

    pool.query(
      "INSERT INTO products SET ?",
      {
        name,
        image_extension,
        image_base64,
        language,
        empresa_id,
        content_html,
        type,
      },
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};

module.exports.updateProducto = (req, res) => {
  try {
    const {
      name,
      image_extension,
      image_base64,
      language,
      empresa_id,
      content_html,
      id,
    } = req.body;

    const image = {};
    if (image_extension !== null) {
      image.image_extension = image_extension;
      image.image_base64 = image_base64;
    }

    pool.query(
      "UPDATE products SET ? WHERE id = ?",
      [
        {
          name,
          ...image,
          language,
          empresa_id,
          content_html,
        },
        id,
      ],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};

module.exports.deleteProducto = (req, res) => {
  try {
    const { id } = req.body;

    pool.query(
      "DELETE FROM products WHERE id = ?",
      [id],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", results });
      }
    );
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};

module.exports.getProducto = (req, res) => {
  try {
    const { id } = req.params;

    pool.query(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ codigo: "1", producto: results[0] });
      }
    );
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};

module.exports.getProductos = (req, res) => {
  const { id, type } = req.params;

  const text_type = type === "productos" ? "productos" : "premios";

  try {
    pool.query(
      "SELECT * FROM products WHERE ? LIMIT 100",
      [{ empresa_id: id, type }],
      function (error, results, fields) {
        if (error) throw error;

        const mensaje =
          results.length > 0
            ? `${results.length} resultado${results.length > 1 ? "s" : ""}`
            : `Esta empresa no tiene ${text_type} asociados`;

        res.json({ codigo: "1", mensaje, results });
      }
    );
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};
