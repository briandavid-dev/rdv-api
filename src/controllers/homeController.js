const { pool } = require("../config/database");

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
