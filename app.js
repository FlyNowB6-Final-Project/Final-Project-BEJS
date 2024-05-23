require("dotenv").config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;
// const server = require('http').createServer(app);
// global.io = require("socket.io")(server);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(routes);

// global.io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('disconnect', () => {
//       console.log('user disconnected');
//   });
// });

app.get("/", (req, res) => {
  res.send(`<h1 align="center">Hello World</h1>`);
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `are you lost? ${req.method} ${req.url} is not registered!`,
    data: null,
  });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

app.listen(PORT, () => console.log("Listening on port :", PORT));
// server.listen(PORT, () => console.log("Listening on port :", PORT));

module.exports = app;