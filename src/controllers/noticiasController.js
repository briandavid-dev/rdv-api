const { pool } = require("../config/database");

let responseAllNoticias = {};
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

  if (lang === lenguaje && Object.keys(responseAllNoticias).length > 0) {
    res.json(responseAllNoticias);
    return;
  } else {
    lenguaje = lang;
  }

  const query = `
    SELECT id, language, title, summary, name_section, created_at, image_extension, content_html, image_base64
    FROM posts
    WHERE language = '${lang}'
    AND name_page = 'noticias'
    ORDER BY created_at DESC
    LIMIT 20;
    `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    const results_ = results.map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    results_.shift();

    responseAllNoticias = {
      codigo: "1",
      results: results_,
    };
    res.json(responseAllNoticias);
  });
};

module.exports.getUltimaNoticia = (req, res) => {
  const { lang } = req.params;

  const listLang = ["es", "en"];
  if (!listLang.includes(lang)) {
    res.json({
      codigo: "0",
      error: "lang fuera de rango",
    });
    return;
  }

  const query = `
    SELECT id, language, title, summary, name_section, created_at, image_extension, content_html, image_base64
    FROM posts
    WHERE language = '${lang}'
    AND name_page = 'noticias'
    ORDER BY created_at DESC
    LIMIT 1;
    `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    const results_ = results.map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    res.json({
      codigo: "1",
      results: results_,
    });
  });
};

module.exports.getNoticia = (req, res) => {
  const { lang, url } = req.params;

  const listLang = ["es", "en"];
  if (!listLang.includes(lang)) {
    res.json({
      codigo: "0",
      error: "lang fuera de rango",
    });
    return;
  }

  if (url.trim() === "") {
    res.json({
      codigo: "0",
      error: "url fuera de rango",
    });
    return;
  }

  const title = url.replace(/-/g, " ");

  const query = `
    SELECT id, language, title, summary, name_section, created_at, image_extension, content_html, image_base64
    FROM posts
    WHERE language = '${lang}'
    AND name_page = 'noticias'
    AND title = '${title}'
    ORDER BY created_at DESC
    LIMIT 1;
    `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    if (results.length < 1) {
      res.status(200).json({
        codigo: "0",
        mensaje: "Not found",
      });
    }

    const results_ = results.map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    res.status(200).json({
      codigo: "1",
      results: results_,
    });
  });
};

module.exports.getNoticiasExcept = (req, res) => {
  const { lang, url } = req.params;

  const listLang = ["es", "en"];
  if (!listLang.includes(lang)) {
    res.json({
      codigo: "0",
      error: "lang fuera de rango",
    });
    return;
  }

  const url_ = url.replace(/-/g, " ");

  const query = `
    SELECT id, language, title, summary, name_section, created_at, image_extension, content_html, image_base64
    FROM posts
    WHERE language = '${lang}'
    AND name_page = 'noticias'
    AND title != '${url_}'
    ORDER BY created_at DESC
    LIMIT 20;
    `;

  pool.query(query, function (error, results, fields) {
    if (error) throw error;

    const results_ = results.map((noticia) => {
      const url = noticia.title.replace(/ /g, "-");
      return {
        url,
        ...noticia,
      };
    });

    responseAllNoticias = {
      codigo: "1",
      results: results_,
    };
    res.json(responseAllNoticias);
  });
};
