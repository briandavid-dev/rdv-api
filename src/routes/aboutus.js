const express = require("express");
const router = express.Router();
const aboutusController = require("../controllers/aboutusController");

router.get("/", aboutusController.getAll);
router.put("/", aboutusController.put);

module.exports = router;
