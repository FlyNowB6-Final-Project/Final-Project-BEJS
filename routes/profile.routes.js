const router = require("express").Router();
const { getDetail, updateProfile } = require("../controllers/profile.controllers");
const restrict = require("../middlewares/auth.middlewares");

router.get('/profile/:id', restrict, getDetail);
router.put('/profile/:id', restrict, updateProfile);

module.exports = router;