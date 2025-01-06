import { generateAccessToken } from "@utils/jwt";
import { Credentials } from "@utils/interfaces";
import { prisma, Errors as PrismaError } from "@utils/database";
import bcrypt from "bcrypt";
import { Errors } from "./errors";
var authenticator = require("authenticator");

export async function signIn(data: Credentials): Promise<string> {
  let user = { email: "", password: "", id: 0, mfaEnabled: false };

  try {
    user = await prisma.user.findUniqueOrThrow({
      where: { email: data.email },
    });
  } catch (error) {
    if (PrismaError.IsUniqueThrow(error)) {
      throw Errors.USER_NOT_EXIST;
    }

    throw error;
  }

  const passwordMatched = await bcrypt.compare(data.password, user.password);
  if (!passwordMatched) {
    throw Errors.INCORRECT_PASSWORD;
  }

  return generateAccessToken({
    email: user.email,
    id: user.id,
    mfa: user.mfaEnabled,
  });
}

export async function verify(userId: number, code: number): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const rest = authenticator.verifyToken(user.mfaSecret, code);
  if (rest?.delta != 0) {
    throw Errors.BAD_MFA_CODE;
  }

  return generateAccessToken({ email: user.email, id: user.id, mfa: true });
}
