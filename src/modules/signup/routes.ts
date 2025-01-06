import express, { Request, Response } from "express";
import { validateBody } from "@middlewares/validation";
import { verifySchema, signupSchema, emailSchema } from "./validations";
import { mfaVerify, signUp, email, emailVerify } from "./service";
import { verifyTokenEmailVerify, verifyTokenWithoutMfa } from "./middlewares";

export const router = express.Router();

router.post(
  "/email",
  validateBody(emailSchema),
  async (req: Request, res: Response) => {
    await email(req.body.email);

    res.status(200).json();
  }
);

router.get("/email-verify", async (req: Request, res: Response) => {
  const secret = req.query.secret as string;
  if (!secret || secret == "") {
    res.status(401).json("secret is not provided on the query params");
    return;
  }

  const token = emailVerify(secret);

  res.status(200).json(token);
});

router.post(
  "/credentials",
  verifyTokenEmailVerify,
  validateBody(signupSchema),
  async (req: Request, res: Response) => {
    const [qr, token] = await signUp(req.body);
    res.status(201).json({ qr, token });
  }
);

router.post(
  "/mfa-verify",
  verifyTokenWithoutMfa,
  validateBody(verifySchema),
  async (req: Request, res: Response) => {
    const userId = res.locals.userId;

    await mfaVerify(userId, req.body.code);

    res.json();
  }
);
