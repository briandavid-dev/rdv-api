const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");

function getAllData(res) {
  pool.query(
    `SELECT * FROM our_people ORDER BY lang, name_section ASC LIMIT 100`,
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
  console.log("BEGIN ourpeopleController getAll");
  getAllData(res);
};

module.exports.put = (req, res) => {
  console.log("BEGIN ourpeopleController put");
  try {
    const {
      lang,
      cuerpoalmaTitle,
      cuerpoalmaContent,
      cuerpoalma2Content,
      unnombreTitle,
      unnombreContent,
    } = req.body;

    const queryUpdate = `
      UPDATE our_people SET 
      title = '${cuerpoalmaTitle.replace(/'/g, "\\'")}', 
      content = '${cuerpoalmaContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'cuerpoalma' AND lang = '${lang}';

      UPDATE our_people SET 
      title = '-', 
      content = '${cuerpoalma2Content.replace(/'/g, "\\'")}' 
      WHERE name_section = 'cuerpoalma2' AND lang = '${lang}';

      UPDATE our_people SET 
      title = '${unnombreTitle.replace(/'/g, "\\'")}', 
      content = '${unnombreContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'unnombre' AND lang = '${lang}';
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
  console.log("BEGIN updateImageDoc | ourpeopleController");

  try {
    const { lang, base64, extension, fieldName, imageAnterior } = req.body;

    if (base64) {
      const imageName = `${uuidv4()}.${extension}`;
      const content = Buffer.from(base64, "base64");

      fs.writeFileSync(`./public/ourpeople/${imageName}`, content);

      const query = `
        UPDATE our_people SET image = '${imageName}'
        WHERE name_section = '${fieldName}' AND lang = '${lang}';
      `;

      pool.query(query, function (error, results, fields) {
        if (error) throw error;

        if (imageAnterior !== "") {
          const path_ = path.join(
            __dirname,
            `../../public/ourpeople//${imageAnterior}`
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
  console.log("BEGIN getImage | ourpeopleController");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/ourpeople/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};
