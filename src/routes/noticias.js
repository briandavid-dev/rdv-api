const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");

router.get("/noticias-listado/:lang", noticiasController.getNoticias);
router.get("/noticias-ultima/:lang", noticiasController.getUltimaNoticia);

module.exports = router;
