const router = require("express").Router();
const controller = require("../controllers/tracks");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const uploadValidate = require("../middleware/uploadValidate");

router.post(
	"/upload",
	auth(["admin", "artist"]),
	upload.fields([{ name: "audio" }, { name: "cover_art "}]),
	uploadValidate({ audio: "audio", cover_art: 'image' }),
	controller.upload
);