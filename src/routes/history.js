const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/", historyController.getAll);
router.put("/", historyController.put);
router.put("/image", historyController.updateImageDoc);
router.get("/image/:fileName", historyController.getImage);

module.exports = router;
