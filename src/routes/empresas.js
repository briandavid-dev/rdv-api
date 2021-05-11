const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");

router.get("/empresas/:lang", empresasController.get);
router.get("/empresa/:id", empresasController.getEmpresa);

module.exports = router;
