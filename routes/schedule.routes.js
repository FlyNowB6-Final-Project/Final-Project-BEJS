const router = require("express").Router();

const scheduleController = require("../controllers/schedule_controller")

router.post("/ticket/schedule", scheduleController.findSchedule)

module.exports = router