const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresasController");

router.get("/empresas/:lang", empresasController.get);
router.get("/empresa/:id", empresasController.getEmpresa);
router.post("/empresa/producto/", empresasController.insertProducto);
router.put("/empresa/producto/", empresasController.updateProducto);
router.delete("/empresa/producto/", empresasController.deleteProducto);
router.get("/empresa/producto/", empresasController.getProducto);
router.get("/empresa/:id/productos/", empresasController.getProductos);

module.exports = router;
