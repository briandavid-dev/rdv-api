const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");

router.get("/empresas/:lang", empresasController.get);

module.exports = router;
