const router = require("express").Router();

const scheduleController = require("../controllers/schedule_controller")

router.post("/ticket/schedule", scheduleController.findSchedule)
router.get("/ticket/schedule/recomendation", scheduleController.mostPurchaseSchedule)

module.exports = router