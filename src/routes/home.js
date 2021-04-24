const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ incre: "iblre" });
});

module.exports = router;
