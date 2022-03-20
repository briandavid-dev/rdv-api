const fs = require("fs");
const { pool } = require("../config/database");

module.exports.getAll = (req, res) => {
  console.log("BEGIN aboutusController getAll");
  const { lang } = req.query;

  pool.query(`SELECT * FROM about_us ORDER BY lang, name_section ASC LIMIT 100`, function (error, results, fields) {
    if (error) throw error;
    res.json({ codigo: "1", results });
  });
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
      UPDATE about_us SET content = '${text1.replace(/'/g, "\\'")}' WHERE name_section = 'text1' AND lang = '${lang}';
      UPDATE about_us SET content = '${text2.replace(/'/g, "\\'")}' WHERE name_section = 'text2' AND lang = '${lang}';
      UPDATE about_us SET content = '${text3.replace(/'/g, "\\'")}' WHERE name_section = 'text3' AND lang = '${lang}';
      UPDATE about_us SET content = '${text4.replace(/'/g, "\\'")}' WHERE name_section = 'text4' AND lang = '${lang}';
      UPDATE about_us SET content = '${text5.replace(/'/g, "\\'")}' WHERE name_section = 'text5' AND lang = '${lang}';
      UPDATE about_us SET content = '${text6.replace(/'/g, "\\'")}' WHERE name_section = 'text6' AND lang = '${lang}';
      UPDATE about_us SET content = '${text7.replace(/'/g, "\\'")}' WHERE name_section = 'text7' AND lang = '${lang}';
      UPDATE about_us SET content = '${text8.replace(/'/g, "\\'")}' WHERE name_section = 'text8' AND lang = '${lang}';
      UPDATE about_us SET content = '${text9.replace(/'/g, "\\'")}' WHERE name_section = 'text9' AND lang = '${lang}';
      UPDATE about_us SET content = '${title1.replace(/'/g, "\\'")}' WHERE name_section = 'title1' AND lang = '${lang}';
      UPDATE about_us SET content = '${title2.replace(/'/g, "\\'")}' WHERE name_section = 'title2' AND lang = '${lang}';
      UPDATE about_us SET content = '${title3.replace(/'/g, "\\'")}' WHERE name_section = 'title3' AND lang = '${lang}';
      UPDATE about_us SET content = '${title4.replace(/'/g, "\\'")}' WHERE name_section = 'title4' AND lang = '${lang}';
      UPDATE about_us SET content = '${title5.replace(/'/g, "\\'")}' WHERE name_section = 'title5' AND lang = '${lang}';
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
