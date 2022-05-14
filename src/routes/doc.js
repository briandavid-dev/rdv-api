const express = require("express");
const router = express.Router();
const docController = require("../controllers/docController");

router.get("/", docController.getAll);
router.get("/image/:fileName", docController.getImage);
router.get("/:fileName", docController.getFile);
router.put("/", docController.put);
router.put("/image", docController.updateImageDoc);
router.delete("/image", docController.deleteFileDoc);

module.exports = router;
