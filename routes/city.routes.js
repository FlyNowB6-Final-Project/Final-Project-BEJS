const router = require("express").Router();

const cityController = require("../controllers/city_controller")

router.get("/city", cityController.getAllCity)

module.exports = router