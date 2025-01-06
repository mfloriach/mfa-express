import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@utils/jwt";

export function verifyToken(
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
    if (!payload.mfa) {
      return res.status(403).json({ message: "MFA is not verified" });
    }

    res.locals.userId = payload.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}
