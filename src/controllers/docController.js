const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");

module.exports.getAll = (req, res) => {
  console.log("BEGIN docController getAll");

  pool.query(`SELECT * FROM doc ORDER BY lang, name_section ASC LIMIT 100`, function (error, results, fields) {
    if (error) throw error;

    const data = {};

    results.forEach((result) => {
      if (result.name_section === "regularizations") {
        if (!data[result.lang]) {
          data[result.lang] = {};
        }
        data[result.lang] = {
          regularizations: {
            title: result.content,
            files: JSON.parse(result.files).map((file) => ({ ...file, id: uuidv4() })),
          },
        };
      }
    });

    res.json({ codigo: "1", data });
  });
};

module.exports.put = (req, res) => {
  console.log("BEGIN docController put");
  try {
    const { lang, regularizations } = req.body;

    const arrayFiles = [];

    regularizations.files.forEach((file) => {
      const text = file.text;
      const base64Img = file.base64;
      const fileName = `${uuidv4()}.${file.extension}`;
      const content = Buffer.from(base64Img, "base64");

      fs.writeFileSync(`./public/doc/attachments/${fileName}`, content);

      arrayFiles.push({
        text,
        fileName,
      });
    });

    const queryUpdate = `
      UPDATE doc SET content = '${regularizations.title}', files = '${JSON.stringify(
      arrayFiles
    )}' WHERE name_section = 'regularizations' AND lang = '${lang}';
    `;

    pool.query(queryUpdate, function (error, results, fields) {
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

module.exports.getFile = (req, res) => {
  console.log("BEGIN docController getFile");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/doc/attachments/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};
