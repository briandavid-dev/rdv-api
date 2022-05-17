const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");

function getAllData(res) {
  pool.query(
    `SELECT * FROM rum ORDER BY lang, name_section ASC LIMIT 100`,
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
  console.log("BEGIN rumController getAll");
  getAllData(res);
};

module.exports.put = (req, res) => {
  console.log("BEGIN rumController put");
  try {
    const {
      lang,
      procesoTitle,
      lacanaTitle,
      lacanaContent,
      lamelazaTitle,
      lamelazaContent,
      lafermentacionTitle,
      lafermentacionContent,
      destilacionContent,
      elanejamientoTitle,
      elanejamientoContent,
      mezclasContent,
    } = req.body;

    const queryUpdate = `
      UPDATE rum SET 
      title = '${procesoTitle.replace(/'/g, "\\'")}'
      WHERE name_section = 'proceso' AND lang = '${lang}';
      
      UPDATE rum SET 
      title = '${lacanaTitle.replace(/'/g, "\\'")}',
      content = '${lacanaContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'lacana' AND lang = '${lang}';
      
      UPDATE rum SET 
      title = '${lamelazaTitle.replace(/'/g, "\\'")}',
      content = '${lamelazaContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'lamelaza' AND lang = '${lang}';
      
      UPDATE rum SET 
      title = '${lafermentacionTitle.replace(/'/g, "\\'")}',
      content = '${lafermentacionContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'lafermentacion' AND lang = '${lang}';
      
      UPDATE rum SET 
      content = '${destilacionContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'destilacion' AND lang = '${lang}';
      
      UPDATE rum SET 
      title = '${elanejamientoTitle.replace(/'/g, "\\'")}',
      content = '${elanejamientoContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'elanejamiento' AND lang = '${lang}';
      
      UPDATE rum SET 
      content = '${mezclasContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'mezclas' AND lang = '${lang}';
      
      
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
  console.log("BEGIN updateImageDoc | rumController");

  try {
    const { lang, base64, extension, fieldName, imageAnterior } = req.body;

    if (base64) {
      const imageName = `${uuidv4()}.${extension}`;
      const content = Buffer.from(base64, "base64");

      fs.writeFileSync(`./public/elron/${imageName}`, content);

      const query = `
        UPDATE rum SET image = '${imageName}'
        WHERE name_section = '${fieldName}' AND lang = '${lang}';
      `;

      pool.query(query, function (error, results, fields) {
        if (error) throw error;

        if (imageAnterior !== "") {
          const path_ = path.join(
            __dirname,
            `../../public/elron/${imageAnterior}`
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
  console.log("BEGIN getImage | rumController");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/elron/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};
