const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

function getAllData(res) {
  pool.query(
    `SELECT * FROM about_us ORDER BY lang, name_section ASC LIMIT 100`,
    function (error, results) {
      if (error) throw error;

      // const data = { en: {}, es: {} };

      // results.forEach((result) => {
      //   data[result.lang][result.name_section] = result;
      // });

      res.json({ codigo: "1", results });
    }
  );
}

module.exports.getAll = (req, res) => {
  console.log("BEGIN aboutusController getAll");
  getAllData(res);
};

module.exports.put = (req, res) => {
  console.log("BEGIN aboutusController put");
  try {
    const {
      text1,
      text2,
      text3,
      text4,
      text5,
      text6,
      text7,
      text8,
      text9,
      title1,
      title2,
      title3,
      title4,
      title5,
      lang,
    } = req.body;

    const queryUpdate = `
      UPDATE about_us SET content = '${text1.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text1' AND lang = '${lang}';
      UPDATE about_us SET content = '${text2.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text2' AND lang = '${lang}';
      UPDATE about_us SET content = '${text3.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text3' AND lang = '${lang}';
      UPDATE about_us SET content = '${text4.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text4' AND lang = '${lang}';
      UPDATE about_us SET content = '${text5.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text5' AND lang = '${lang}';
      UPDATE about_us SET content = '${text6.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text6' AND lang = '${lang}';
      UPDATE about_us SET content = '${text7.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text7' AND lang = '${lang}';
      UPDATE about_us SET content = '${text8.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text8' AND lang = '${lang}';
      UPDATE about_us SET content = '${text9.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'text9' AND lang = '${lang}';
      UPDATE about_us SET content = '${title1.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'title1' AND lang = '${lang}';
      UPDATE about_us SET content = '${title2.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'title2' AND lang = '${lang}';
      UPDATE about_us SET content = '${title3.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'title3' AND lang = '${lang}';
      UPDATE about_us SET content = '${title4.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'title4' AND lang = '${lang}';
      UPDATE about_us SET content = '${title5.replace(
        /'/g,
        "\\'"
      )}' WHERE name_section = 'title5' AND lang = '${lang}';
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
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

module.exports.updateImageDoc = (req, res) => {
  console.log("BEGIN updateImageDoc | aboutusController");

  try {
    const { lang, base64, extension, fieldName, imageAnterior } = req.body;

    if (base64) {
      const imageName = `${uuidv4()}.${extension}`;
      const content = Buffer.from(base64, "base64");

      fs.writeFileSync(`./public/aboutus/${imageName}`, content);

      const query = `
        UPDATE about_us SET content = '${imageName}'
        WHERE name_section = '${fieldName}' AND lang = '${lang}';
      `;

      pool.query(query, function (error, results, fields) {
        if (error) throw error;

        if (imageAnterior !== "") {
          const path_ = path.join(
            __dirname,
            `../../public/aboutus/${imageAnterior}`
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
  console.log("BEGIN getImage | aboutusController");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/aboutus/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};
