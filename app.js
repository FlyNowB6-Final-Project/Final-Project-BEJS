require("dotenv").config();
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONTMENT,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require("cors");
const routes = require("./routes");
// const task = require("./service/cron_schedule_service");
const errorMiddleware = require("./middlewares/error_middleware");


const app = express();
const PORT = process.env.PORT || 3000;




app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(routes);

app.get("/", (req, res) => {
  res.send(`<h1 align="center">Welcome To API Flynow Foundation</h1>`);
});

// task.start()

app.use(errorMiddleware);

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => console.log("Listening on port :", PORT));

module.exports = app;
