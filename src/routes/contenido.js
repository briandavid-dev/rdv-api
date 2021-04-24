const express = require("express");
const router = express.Router();
const contenidoController = require("../controllers/contenidoController");

router.get("/contenido/", contenidoController.get);

router.post("/contenido/", contenidoController.post);

router.put("/contenido/", contenidoController.update);

router.delete("/contenido", contenidoController.delete);

module.exports = router;