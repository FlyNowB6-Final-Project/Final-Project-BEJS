const router = require("express").Router();

const { index, readNotification, create, readNotificationId } = require("../controllers/notif.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get("/notifications", restrict, index);
router.post("/notifications",restrict, create);
router.put("/notifications/markAsRead/all",restrict, readNotification)
router.put("/notification/markAsRead/:notificationId", restrict, readNotificationId)

module.exports = router;
