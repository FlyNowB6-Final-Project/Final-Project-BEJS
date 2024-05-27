const router = require("express").Router();

const seatClassController = require("../controllers/seat_class_controller")

router.get("/ticket/class", seatClassController.getAllSeatClass)

module.exports = router