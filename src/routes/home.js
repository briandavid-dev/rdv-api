const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/noticias/:lang", homeController.getNoticias);

module.exports = router;
