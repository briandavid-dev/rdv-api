const express = require("express");
const router = express.Router();
const ourpeopleController = require("../controllers/ourpeopleController");

router.get("/", ourpeopleController.getAll);
router.put("/", ourpeopleController.put);
router.put("/image", ourpeopleController.updateImageDoc);
router.get("/image/:fileName", ourpeopleController.getImage);

module.exports = router;
