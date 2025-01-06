import express, { Request, Response } from "express";
import { signinSchema, mfaSchema } from "@modules/session/validations";
import { validateBody } from "@middlewares/validation";
import { verifyToken } from "@middlewares/verifyToken";
import { signIn, verify } from "./service";
import { ErrorMiddleware } from "./errors";

export const router = express.Router();

router.post(
  "/signin",
  validateBody(signinSchema),
  async (req: Request, res: Response) => {
    const token = await signIn(req.body);
    res.status(200).json(token);
  }
);

router.post(
  "/verify",
  verifyToken,
  validateBody(mfaSchema),
  async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const token = await verify(userId, req.body.code);

    res.status(200).json(token);
  }
);

router.get("/signout", verifyToken as any, (req: Request, res: Response) => {
  res.send("logout");
});

router.use(ErrorMiddleware);
