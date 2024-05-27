const router = require("express").Router();

const { create, index, show, history } = require("../controllers/payment.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.post("/payments",restrict, create);
router.get("/payments", restrict, index);
router.get("/payments/:id",restrict, show);
router.get("/payments/history",restrict, history);

module.exports = router;
