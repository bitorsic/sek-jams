const router = require("express").Router();
const controller = require("../controllers/auth");
const pictureUpload = require("../middleware/pictureUpload");

router.post("/register", pictureUpload.single("profile_picture"), controller.register);
router.post("/login", controller.login);

module.exports = router;