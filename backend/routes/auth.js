const router = require("express").Router();
const controller = require("../controllers/auth");
const upload = require("../middleware/upload");
const uploadValidate = require("../middleware/uploadValidate");

router.post(
	"/register", 
	upload.fields([{ name: "profile_picture" }]), 
	uploadValidate({ profile_picture: 'image' }),
	controller.register
);
router.post("/login", controller.login);

module.exports = router;