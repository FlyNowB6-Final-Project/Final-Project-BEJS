const express = require('express');
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const User = require("./user.routes")
const Profile = require("./profile.routes")
const cityRoute = require("./city.routes")
const classRoute = require("./seat_class.routes")
const scheduleRoute = require("./schedule.routes")
const continentRoute = require("./continent.routes")
const Flights = require("./flight.routes")
const Plane = require("./plane.routes")
const Payments = require("./payment.routes")
const Order = require("./order.routes")
const Notifications = require("./notif.routes")

const swagger_path = path.resolve(__dirname, "../docs/api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API
router.use("/api/v1", User)
router.use("/api/v1", Profile)
router.use("/api/v1", cityRoute)
router.use("/api/v1", classRoute)
router.use("/api/v1", scheduleRoute)
router.use("/api/v1", Flights)
router.use("/api/v1", Plane)
router.use("/api/v1", continentRoute)
router.use("/api/v1", Payments)
router.use("/api/v1", Order)
router.use("/api/v1", Notifications)

module.exports = router;