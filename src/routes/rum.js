const express = require("express");
const router = express.Router();
const rumController = require("../controllers/rumController");

router.get("/", rumController.getAll);
router.put("/", rumController.put);
router.put("/image", rumController.updateImageDoc);
router.get("/image/:fileName", rumController.getImage);

module.exports = router;
