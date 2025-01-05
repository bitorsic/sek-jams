const router = require("express").Router();
const controller = require("../controllers/genres");
const auth = require("../middleware/auth");

router.post("/create", auth(["admin"]), controller.create);

module.exports = router;