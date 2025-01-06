require("express-async-errors");
import express, { Express } from "express";
import bodyParser from "body-parser";
import { router as session } from "@modules/session/routes";
import { router as signup } from "@modules/signup/routes";
import { logger } from "@utils/logger";
import { accessLog } from "@middlewares/accessLog";
import { prisma } from "@utils/database";

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(accessLog);

app.use("/api/auth", session);
app.use("/api/auth/register", signup);

const server = app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received.");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Closed out remaining connections");
  });
});
