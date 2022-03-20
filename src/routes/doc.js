const express = require("express");
const router = express.Router();
const docController = require("../controllers/docController");

router.get("/", docController.getAll);
router.put("/", docController.put);
router.get("/:fileName", docController.getFile);

module.exports = router;
