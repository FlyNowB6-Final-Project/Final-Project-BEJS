const router = require("express").Router();

const seatClassController = require("../controllers/seat_class_controller")

router.get("/", seatClassController.getAllSeatClass)

module.exports = router