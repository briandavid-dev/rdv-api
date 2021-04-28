const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");

router.get("/noticias-listado/:lang", noticiasController.getNoticias);
router.get("/noticias-ultima/:lang", noticiasController.getUltimaNoticia);
router.get("/noticias/:url/:lang", noticiasController.getNoticia);
router.get(
  "/noticias-excepto/:url/:lang",
  noticiasController.getNoticiasExcept
);

module.exports = router;
