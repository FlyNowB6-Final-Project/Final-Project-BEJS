const router = require("express").Router();

const { index, readNotification, create } = require("../controllers/notif.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get("/notifications", restrict, index);
router.post("/notifications",restrict, create);
router.put("/notifications/markAsRead",restrict, readNotification)

module.exports = router;
