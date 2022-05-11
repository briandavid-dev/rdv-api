const { pool } = require("../config/database");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

let responseAllNoticias0 = {};
let responseAllNoticias1 = {};
let lenguaje = "";

module.exports.getNoticias = (req, res) => {
  const { lang } = req.params;

  const listLang = ["es", "en"];
  if (!listLang.includes(lang)) {
    res.json({
      codigo: "0",
      error: "lang fuera de rango",
    });
    return;
  }

  /* if (
    JSON.stringify(responseAllNoticias0) ===
    JSON.stringify(responseAllNoticias1)
  ) {
    res.status(201).json({
      codigo: "1",
      results: { circulo: responseAllNoticias0, cuadro: responseAllNoticias1 },
    });
  } */

  const query = `
    SELECT id, title, summary, name_section, created_at, image_extension , image_base64
    FROM posts
    WHERE name_section = 'circulo'
    AND language = '${lang}'
    AND name_page = 'noticias'
    ORDER BY created_at DESC
    LIMIT 3;

    SELECT id, title, summary, name_section, created_at, image_extension , image_base64
    FROM posts
    WHERE name_section = 'cuadro'
    AND language = '${lang}'
    AND name_page = 'noticias'
    ORDER BY created_at DESC
    LIMIT 5
    `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    const results0_ = results[0].map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    const results1_ = results[1].map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    responseAllNoticias0 = results0_;
    responseAllNoticias1 = results1_;

    res.json({
      codigo: "1",
      results: { circulo: responseAllNoticias0, cuadro: responseAllNoticias1 },
    });
  });
};

module.exports.getAllPageHome = (req, res) => {
  console.log("getAllPageHome");

  const { lang } = req.params;

  const query = `
    SELECT section, title, info, language, image
    FROM home
    ORDER BY id, section DESC
    LIMIT 1000;
  `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    const data = { es: {}, en: {} };

    results.forEach((result) => {
      data[result.language][result.section] = result;
    });

    res.json({ codigo: "1", data });
  });
};

module.exports.put = (req, res) => {
  console.log("BEGIN put | homeController");

  try {
    const {
      bannerTitle,
      bannerInfo,
      elronTitle,
      elronInfo,
      elronFile,
      procesoelaboracionTitle,
      procesoelaboracionInfo,
      procesoelaboracionFile,
      logosempresasTitle,
      footer1Info,
      footer2Info,
      rsFacebook,
      rsInstagram,
      rsYoutube,
      lang,
    } = req.body;

    let elronFileNameQuery = "";
    let procesoelaboracionFileNameQuery = "";

    if (elronFile) {
      const base64Img = elronFile.base64;
      elronFileName = `${uuidv4()}.${elronFile.extension}`;
      const content = Buffer.from(base64Img, "base64");
      fs.writeFileSync(`./public/home/${elronFileName}`, content);
      elronFileNameQuery = `,image = '${elronFileName}'`;
    }
    if (procesoelaboracionFile) {
      const base64Img = procesoelaboracionFile.base64;
      procesoelaboracionFileName = `${uuidv4()}.${
        procesoelaboracionFile.extension
      }`;
      const content = Buffer.from(base64Img, "base64");
      fs.writeFileSync(`./public/home/${procesoelaboracionFileName}`, content);
      procesoelaboracionFileNameQuery = `,image = '${procesoelaboracionFileName}'`;
    }

    const queryUpdate = `
      UPDATE home SET 
      title = '${bannerTitle.replace(/'/g, "\\'")}', 
      info = '${bannerInfo.replace(/'/g, "\\'")}' 
      WHERE section = 'banner' AND language = '${lang}';

      UPDATE home SET 
      title = '${elronTitle.replace(/'/g, "\\'")}', 
      info = '${elronInfo.replace(/'/g, "\\'")}' 
      ${elronFileNameQuery}
      WHERE section = 'elron' AND language = '${lang}';

      UPDATE home SET 
      title = '${procesoelaboracionTitle.replace(/'/g, "\\'")}', 
      info = '${procesoelaboracionInfo.replace(/'/g, "\\'")}' 
      ${procesoelaboracionFileNameQuery}
      WHERE section = 'procesoelaboracion' AND language = '${lang}';

      UPDATE home SET 
      title = '${logosempresasTitle.replace(/'/g, "\\'")}', 
      info = '-' 
      WHERE section = 'logosempresas' AND language = '${lang}';

      UPDATE home SET 
      title = '-', 
      info = '${footer1Info.replace(/'/g, "\\'")}' 
      WHERE section = 'footer1' AND language = '${lang}';

      UPDATE home SET 
      title = '-', 
      info = '${footer2Info.replace(/'/g, "\\'")}' 
      WHERE section = 'footer2' AND language = '${lang}';

      UPDATE home SET 
      title = '-', 
      info = '${rsFacebook}' 
      WHERE section = 'rsFacebook' AND language = '${lang}';

      UPDATE home SET 
      title = '-', 
      info = '${rsInstagram}' 
      WHERE section = 'rsInstagram' AND language = '${lang}';

      UPDATE home SET 
      title = '-', 
      info = '${rsYoutube}' 
      WHERE section = 'rsYoutube' AND language = '${lang}';

      SELECT section, title, info, language, image
      FROM home
      ORDER BY id, section DESC
      LIMIT 1000;
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
      if (error) throw error;

      const data = { es: {}, en: {} };
      results[9].forEach((result) => {
        data[result.language][result.section] = result;
      });

      res.json({ codigo: "1", data });
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
  console.log("BEGIN homeController getFile");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/home/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};

module.exports.getFileHomeLogosEmpresas = (req, res) => {
  console.log("BEGIN homeController getFileHomeLogosEmpresas");
  const { fileName } = req.params;
  const path_ = path.join(
    __dirname,
    `../../public/homeLogosEmpresas/${fileName}`
  );

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};

module.exports.postLogoEmpresa = (req, res) => {
  console.log("BEGIN postLogoEmpresa | homeController");

  try {
    const { logoEmpresaFile, imagenesAnteriores, lang } = req.body;
    let logoEmpresaFileQuery = "";

    if (logoEmpresaFile) {
      const base64Img = logoEmpresaFile.base64;
      const logoEmpresaFileName = `${uuidv4()}.${logoEmpresaFile.extension}`;
      const content = Buffer.from(base64Img, "base64");
      fs.writeFileSync(
        `./public/homeLogosEmpresas/${logoEmpresaFileName}`,
        content
      );
      logoEmpresaFileQuery = `,image = '${
        imagenesAnteriores === "" ? "" : `${imagenesAnteriores},`
      }${logoEmpresaFileName}'`;
    }

    const queryUpdate = `
      UPDATE home SET 
      info = '-'
      ${logoEmpresaFileQuery}
      WHERE section = 'logosempresas' AND language = '${lang}';

      SELECT section, title, info, language, image
      FROM home
      ORDER BY id, section DESC
      LIMIT 1000;
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
      if (error) throw error;

      const data = { es: {}, en: {} };
      results[1].forEach((result) => {
        data[result.language][result.section] = result;
      });

      res.json({ codigo: "1", data });
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

module.exports.putLogosEmpresas = (req, res) => {
  console.log("BEGIN putLogosEmpresa | homeController");

  try {
    const { filesNames, lang } = req.body;

    const queryUpdate = `
      UPDATE home SET image = '${filesNames}'
      WHERE section = 'logosempresas' AND language = '${lang}';

      SELECT section, title, info, language, image
      FROM home
      ORDER BY id, section DESC
      LIMIT 1000;
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
      if (error) throw error;

      const data = { es: {}, en: {} };
      results[1].forEach((result) => {
        data[result.language][result.section] = result;
      });

      res.json({ codigo: "1", data });
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

module.exports.postVideoHome = (req, res) => {
  console.log("BEGIN postVideoHome | homeController");

  try {
    const { homeVideoFile, lang } = req.body;

    let homeVideoFileQuery = `
      UPDATE home SET title = '-'
      WHERE section = 'video' AND language = '${lang}'; 
    `;
    if (homeVideoFile) {
      const base64 = homeVideoFile.base64;
      const homeVideoFileName = `${uuidv4()}.${homeVideoFile.extension}`;
      const content = Buffer.from(base64, "base64");
      fs.writeFileSync(`./public/homeVideos/${homeVideoFileName}`, content);
      homeVideoFileQuery = `
        UPDATE home SET info = '${homeVideoFileName}'
        WHERE section = 'video' AND language = '${lang}';
      `;
    }

    const queryUpdate = `
      ${homeVideoFileQuery}

      SELECT section, title, info, language, image
      FROM home
      ORDER BY id, section DESC
      LIMIT 1000;
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
      if (error) throw error;

      const data = { es: {}, en: {} };
      results[1].forEach((result) => {
        data[result.language][result.section] = result;
      });

      res.json({ codigo: "1", data });
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

module.exports.getFileHomeVideo = (req, res) => {
  console.log("BEGIN homeController getFileHomeVideo");
  const { fileName } = req.params;
  const path_ = path.join(__dirname, `../../public/homeVideos/${fileName}`);

  if (!fs.existsSync(path_)) {
    res.status(404).json({ codigo: "0", message: "File not found" });
  }

  res.sendFile(path_);
};

module.exports.getRrssFooter = (req, res) => {
  console.log("BEGIN getRrssFooter | homeController");

  try {
    const queryUpdate = `
      SELECT section, info, language
      FROM home
      WHERE section IN('rsFacebook','rsInstagram','rsYoutube','footer1','footer2')
      ORDER BY id, section DESC
      LIMIT 1000;
    `;

    pool.query(queryUpdate, [], function (error, results, fields) {
      if (error) throw error;

      const data = { es: {}, en: {} };
      results.forEach((result) => {
        data[result.language][result.section] = result;
      });

      res.json({ codigo: "1", data });
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
