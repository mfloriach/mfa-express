const json = require("morgan-json");
import morgan from "morgan";

const format = json({
  method: ":method",
  url: ":url",
  status: ":status",
  length: ":res[content-length]",
  "response-time": ":response-time ms",
});

export const accessLog = morgan(format);
