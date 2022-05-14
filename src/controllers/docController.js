const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");

function getAllDoc(res) {
  pool.query(
    `SELECT * FROM doc ORDER BY lang, name_section ASC LIMIT 100`,
    function (error, results, fields) {
      if (error) throw error;

      const data = { en: {}, es: {} };

      results.forEach((result) => {
        if (result.name_section === "regularizations") {
          data[result.lang]["regularizations"] = {
            title: result.content,
            files: JSON.parse(result.files).map((file) => ({
              ...file,
              id: uuidv4(),
            })),
          };
        } else {
          data[result.lang][result.name_section] = result;
        }
      });

      res.json({ codigo: "1", data });
    }
  );
}

module.exports.getAll = (req, res) => {
  console.log("BEGIN docController getAll");
  getAllDoc(res);
};

module.exports.put = (req, res) => {
  console.log("BEGIN docController put");
  try {
    const {
      lang,
      // regularizations,
      queesTitle,
      queesContent,
      actaNacimientoTitle,
      actaNacimientoContent,
      organismoReguladorTitle,
      organismoReguladorContent,
      funcionesTitle,
      funcionesContent,
      organizacionTitle,
      organizacionContent,
      porqueexisteTitle,
      porqueexisteContent,
    } = req.body;

    const arrayFiles = [];

    // regularizations.files.forEach((file) => {
    //   const text = file.text;
    //   const base64Img = file.base64;
    //   const fileName = `${uuidv4()}.${file.extension}`;
    //   const content = Buffer.from(base64Img, "base64");

    //   fs.writeFileSync(`./public/doc/attachments/${fileName}`, content);

    //   arrayFiles.push({
    //     text,
    //     fileName,
    //   });
    // });

    const queryUpdate = `
      UPDATE doc SET image = '-' WHERE name_section = 'regularizations' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${queesTitle.replace(/'/g, "\\'")}', 
      content = '${queesContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'quees' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${actaNacimientoTitle.replace(/'/g, "\\'")}', 
      content = '${actaNacimientoContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'acta_nacimiento' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${organismoReguladorTitle.replace(/'/g, "\\'")}', 
      content = '${organismoReguladorContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'organismo_regulador' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${funcionesTitle.replace(/'/g, "\\'")}', 
      content = '${funcionesContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'funciones' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${organizacionTitle.replace(/'/g, "\\'")}', 
      content = '${organizacionContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'organizacion' AND lang = '${lang}';

      UPDATE doc SET 
      title = '${porqueexisteTitle.replace(/'/g, "\\'")}', 
      content = '${porqueexisteContent.replace(/'/g, "\\'")}' 
      WHERE name_section = 'porqueexiste' AND lang = '${lang}';

    `;

    pool.query(queryUpdate, function (error, results, fields) {
      if (error) throw error;
      getAllDoc(res);
      // res.json({ codigo: "1", results });
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
  const path_ = path.join(
    __dirname,
    `../../public/doc/attachments/${fileName}`
  );

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};

module.exports.getImage = (req, res) => {
  console.log("BEGIN getImage | docController");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/doc/images/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};

module.exports.updateImageDoc = (req, res) => {
  console.log("BEGIN updateImageDoc | docController");

  try {
    const {
      lang,
      base64,
      extension,
      fieldName,
      regularizationsFilesAnteriores,
      titleFileRegularization,
    } = req.body;

    if (base64) {
      const imageName = `${uuidv4()}.${extension}`;
      const content = Buffer.from(base64, "base64");
      let dir = "images";
      if (extension === "pdf") dir = "attachments";

      fs.writeFileSync(`./public/doc/${dir}/${imageName}`, content);

      let queryUpdate = `
        UPDATE doc SET image = '${imageName}'
        WHERE name_section = '${fieldName}' AND lang = '${lang}';
      `;
      if (extension === "pdf") {
        const updateFilesRegularizations = regularizationsFilesAnteriores;
        updateFilesRegularizations.push({
          text: titleFileRegularization,
          fileName: imageName,
        });

        queryUpdate = `
          UPDATE doc SET files = '${JSON.stringify(updateFilesRegularizations)}'
          WHERE name_section = 'regularizations' AND lang = '${lang}';
        `;
      }

      pool.query(queryUpdate, function (error, results, fields) {
        if (error) throw error;
        getAllDoc(res);
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

module.exports.deleteFileDoc = (req, res) => {
  console.log("BEGIN deleteFileDoc | docController");

  try {
    const { lang, fileName, updateCurrentFiles } = req.body;

    const dir = "attachments";
    const query = `
    UPDATE doc SET files = '${JSON.stringify(updateCurrentFiles)}'
    WHERE name_section = 'regularizations' AND lang = '${lang}'`;

    pool.query(query, function (error, results, fields) {
      if (error) throw error;

      const path_ = path.join(__dirname, `../../public/doc/${dir}/${fileName}`);
      if (fs.existsSync(path_)) fs.unlinkSync(path_);

      getAllDoc(res);
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
