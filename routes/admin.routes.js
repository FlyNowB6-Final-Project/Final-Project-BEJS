const router = require("express").Router();
const {
  countAllUser,
  getAllUser,
  getAllOrder,
  getDetailOrderUser,
  createNotif,
  uploadCronAdmin,
  getCronJobData,
} = require("../controllers/admin.controllers");
const { createPlane, getAirlines } = require("../controllers/plane_controller");
const { restrict, isAdmin } = require("../middlewares/auth.middlewares");

router.get("/admin/count", restrict, isAdmin, countAllUser);
router.get("/admin/all/user", restrict, isAdmin, getAllUser);
router.get("/admin/all/order", restrict, isAdmin, getAllOrder);
router.get("/admin/order/user/:userId", restrict, isAdmin, getDetailOrderUser);
router.post("/admin/notifications", restrict, isAdmin, createNotif);


router.post("/admin/flight", restrict, isAdmin, uploadCronAdmin)
router.get("/admin/flight", restrict, isAdmin, getCronJobData)

router.post("/admin/plane", restrict, isAdmin, createPlane)
router.get("/admin/airlines", restrict, isAdmin, getAirlines)

module.exports = router;
