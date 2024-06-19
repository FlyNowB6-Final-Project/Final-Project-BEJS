const router = require("express").Router();
const {
  countAllUser,
  getAllUser,
  getAllOrder,
  getDetailOrderUser,
  createNotif,
} = require("../controllers/admin.controllers");
// const restrict = require("../middlewares/auth.middlewares");

router.get("/admin/count", countAllUser);
router.get("/admin/all/user", getAllUser);
router.get("/admin/all/order", getAllOrder);
router.get("/admin/order/user/:userId", getDetailOrderUser);
router.post("/admin/notifications", createNotif);

module.exports = router;
