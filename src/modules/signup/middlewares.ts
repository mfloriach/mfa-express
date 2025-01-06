import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@utils/jwt";

export function verifyTokenEmailVerify(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }

  try {
    const payload: any = verifyJwt(token);
    if (!payload.emailConfirmed) {
      return res.status(403).json({ message: "Email is not verified" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}

export function verifyTokenWithoutMfa(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }

  try {
    const payload: any = verifyJwt(token);
    if (payload.mfaEnabled) {
      return res.status(403).json({ message: "MFA is already verified" });
    }

    res.locals.userID = payload.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}
