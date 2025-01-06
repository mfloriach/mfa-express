const { createLogger, format, transports } = require("winston");

export const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.errors({ stack: true })
  ),
  transports: [new transports.Console()],
});
