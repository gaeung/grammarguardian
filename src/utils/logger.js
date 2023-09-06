const { createLogger, format, transports } = require("winston");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: () => moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "grammarguardian" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

module.exports = logger;
