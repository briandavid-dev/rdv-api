const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/noticias/:lang", homeController.getNoticias);
router.get("/", homeController.getAllPageHome);
router.put("/", homeController.put);
router.get("/rrss-footer", homeController.getRrssFooter);
router.get("/:fileName", homeController.getFile);
router.get("/logo-empresa/:fileName", homeController.getFileHomeLogosEmpresas);
router.post("/logo-empresa", homeController.postLogoEmpresa);
router.put("/logos-empresas", homeController.putLogosEmpresas);
router.post("/video-home", homeController.postVideoHome);
router.get("/video/:fileName", homeController.getFileHomeVideo);

module.exports = router;
