const router = require("express").Router();

const { order, getAll, getDetail } = require("../controllers/order.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.post("/ticket/order", restrict, order);
router.get("/ticket/order", restrict, getAll); 
router.get("/ticket/order/:orderId", restrict, getDetail);

module.exports = router;
