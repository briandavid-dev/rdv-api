const { pool } = require("../config/database");

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
    res.json({
      codigo: "1",
      results: { circulo: results[0], cuadro: results[1] },
    });
  });
};
