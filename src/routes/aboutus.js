const express = require("express");
const router = express.Router();
const aboutusController = require("../controllers/aboutusController");

router.get("/", aboutusController.getAll);
router.put("/", aboutusController.put);
router.put("/image", aboutusController.updateImageDoc);
router.get("/image/:fileName", aboutusController.getImage);

module.exports = router;
