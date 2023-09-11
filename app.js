const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const routes = require("./src/routes");
const { errorHandler } = require("./src/utils/error");
const subscription = require("./src/utils/subscription");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(routes);
  app.use(errorHandler);

  app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong!" });
  });

  subscription();

  return app;
};

module.exports = { createApp };
