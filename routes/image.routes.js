const { getImageByCity } = require("../controllers/image_controller");

const router = require("express").Router();

router.get("/image", getImageByCity);

module.exports = router;
