const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "51.161.116.237",
  user: "bmosoluc_rdv_user",
  password: "RDVrdv..1324",
  database: "bmosoluc_rdv_web_cms",
  multipleStatements: true,
});
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: "127.0.0.1",
//   user: "root",
//   password: "root",
//   database: "rdv",
//   multipleStatements: true,
// });

module.exports = { pool };
