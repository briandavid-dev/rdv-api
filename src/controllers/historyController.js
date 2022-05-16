const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");

function getAllData(res) {
  pool.query(
    `SELECT * FROM history ORDER BY lang, name_section ASC LIMIT 100`,
    function (error, results) {
      if (error) throw error;

      const data = { en: {}, es: {} };

      results.forEach((result) => {
        data[result.lang][result.name_section] = result;
      });

      res.json({ codigo: "1", data });
    }
  );
}

module.exports.getAll = (req, res) => {
  console.log("BEGIN historyController getAll");
  getAllData(res);
};

module.exports.put = (req, res) => {
  console.log("BEGIN historyController put");
  try {
    const {
      lang,
      nuestrahistoria1Title,
      nuestrahistoria1Content,
      nuestrahistoria2Content,
      nuestrahistoria3Content,
      nuestrahistoria4Content,
    } = req.body;

    const queryUpdate = `
      UPDATE history SET 
      title = '${nuestrahistoria1Title.replace(/'/g, "\\'")}', 
      content = '${nuestrahistoria1Content.replace(/'/g, "\\'")}' 
      WHERE name_section = 'nuestrahistoria1' AND lang = '${lang}';
      
      UPDATE history SET 
      content = '${nuestrahistoria2Content.replace(/'/g, "\\'")}' 
      WHERE name_section = 'nuestrahistoria2' AND lang = '${lang}';
      
      UPDATE history SET 
      content = '${nuestrahistoria3Content.replace(/'/g, "\\'")}' 
      WHERE name_section = 'nuestrahistoria3' AND lang = '${lang}';
      
      UPDATE history SET 
      content = '${nuestrahistoria4Content.replace(/'/g, "\\'")}' 
      WHERE name_section = 'nuestrahistoria4' AND lang = '${lang}';
      
    `;

    pool.query(queryUpdate, function (error, results, fields) {
      if (error) throw error;
      getAllData(res);
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

module.exports.updateImageDoc = (req, res) => {
  console.log("BEGIN updateImageDoc | historyController");

  try {
    const { lang, base64, extension, fieldName, imageAnterior } = req.body;

    if (base64) {
      const imageName = `${uuidv4()}.${extension}`;
      const content = Buffer.from(base64, "base64");

      fs.writeFileSync(`./public/history/${imageName}`, content);

      const query = `
        UPDATE history SET image = '${imageName}'
        WHERE name_section = '${fieldName}' AND lang = '${lang}';
      `;

      pool.query(query, function (error, results, fields) {
        if (error) throw error;

        if (imageAnterior !== "") {
          const path_ = path.join(
            __dirname,
            `../../public/history/${imageAnterior}`
          );
          if (fs.existsSync(path_)) fs.unlinkSync(path_);
        }

        getAllData(res);
      });
    } else {
      res.json({ codigo: "0", message: "No se pudo guardar la imagen" });
    }
  } catch (error) {
    fs.writeFile("error.log", error, function (err) {
      if (err) {
        return console.log(err);
      }
    });
    res.json({ codigo: "0", message: "error" });
  }
};

module.exports.getImage = (req, res) => {
  console.log("BEGIN getImage | historyController");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/history/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};
