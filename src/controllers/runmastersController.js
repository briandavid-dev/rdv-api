const fs = require("fs");
const { pool } = require("../config/database");

module.exports.getAll = (req, res) => {
  console.log("BEGIN getAll");
  const { lang } = req.query;

  pool.query(
    `SELECT * FROM run_masters WHERE language = '${lang}' ORDER BY title ASC LIMIT 100`,
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    }
  );
};

module.exports.getOne = (req, res) => {
  console.log("BEGIN getOne");
  const { id } = req.params;

  pool.query(`SELECT * FROM run_masters WHERE id = '${id}'`, function (error, results, fields) {
    if (error) throw error;
    res.json({ codigo: "1", results });
  });
};

module.exports.post = (req, res) => {
  console.log("BEGIN post");
  try {
    const { title, info, language, imagen } = req.body;
    console.log("req.body", req.body);

    pool.query(
      "INSERT INTO run_masters SET ?",
      {
        title,
        info,
        language,
        image_base64: imagen[0][0].base64,
        image_extension: imagen[0][0].extension,
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

module.exports.put = (req, res) => {
  console.log("BEGIN put");
  try {
    const { title, info, language, imagen } = req.body;
    const { id } = req.params;

    const image = {};
    if (imagen.length > 0) {
      // image.image_extension = image_extension;
      // image.image_base64 = image_base64;
      image.image_extension = imagen[0][0].extension;
      image.image_base64 = imagen[0][0].base64;
    }

    pool.query(
      "UPDATE run_masters SET ? WHERE id = ?",
      [
        {
          title,
          info,
          language,
          ...image,
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

module.exports.delete = (req, res) => {
  console.log("BEGIN delete");
  try {
    const { id } = req.params;
    console.log("id", id);

    pool.query("DELETE FROM run_masters WHERE id = ?", [id], function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    });
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};
