import jwt from "jsonwebtoken";
import { config } from "@config/index";

export function generateAccessToken(data: any) {
  return jwt.sign(data, config.TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
}

export function verifyJwt(token: any) {
  return jwt.verify(token, config.TOKEN_SECRET as string);
}
