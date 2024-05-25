const express = require('express');
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const User = require("./user.routes")
const cityRoute = require("./city.routes")
const classRoute = require("./seat_class.routes")
const scheduleRoute = require("./schedule.routes")

const swagger_path = path.resolve(__dirname, "../docs/api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API
router.use("/api/v1", User)
router.use("/api/v1", cityRoute)
router.use("/api/v1", classRoute)
router.use("/api/v1", scheduleRoute)

module.exports = router;