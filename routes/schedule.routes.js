const router = require("express").Router();

const scheduleController = require("../controllers/schedule_controller")

router.post("/", scheduleController.findSchedule)

module.exports = router