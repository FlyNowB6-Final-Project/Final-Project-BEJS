const router = require("express").Router();

const { getAll} = require("../controllers/country.controllers");

router.get("/countries", getAll);

module.exports = router;