const fs = require("fs");
const { pool } = require("../config/database");

module.exports.get = (req, res) => {
  const { lang } = req.params;

  pool.query(
    `SELECT * FROM posts WHERE language = '${lang}' AND name_page = 'empresas' LIMIT 100`,
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", results });
    }
  );
};

module.exports.getEmpresa = (req, res) => {
  const { id } = req.params;

  pool.query(
    `SELECT * FROM posts WHERE id = '${id}' AND name_page = 'empresas'`,
    function (error, results, fields) {
      if (error) throw error;
      res.json({ codigo: "1", empresa: results[0] });
    }
  );
};
