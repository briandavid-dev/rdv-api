const express = require("express");
const router = express.Router();
const runmastersController = require("../controllers/runmastersController");

router.get("/", runmastersController.getAll);
router.get("/:id", runmastersController.getOne);
router.post("/", runmastersController.post);
router.put("/:id", runmastersController.put);
router.delete("/:id", runmastersController.delete);

module.exports = router;
