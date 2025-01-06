var authenticator = require("authenticator");
const QRCode = require("qrcode");
import { prisma, Errors as PrismaError } from "@utils/database";
import { Credentials } from "@utils/interfaces";
import { Errors } from "./errors";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@utils/jwt";
import { sendEmail } from "@modules/signup/queues";
import { config } from "@config";

export async function email(email: string): Promise<void> {
  const exists = !!(await prisma.user.findFirst({
    where: {
      email: email,
    },
  }));
  if (exists) {
    throw Errors.EMAIL_IS_NOT_UNIQUE;
  }

  const emailSecret = generateAccessToken({
    email,
    id: 0,
    emailConfirmed: false,
  });

  sendEmail({
    from: config.EMAIL_USER as string,
    to: email,
    subject: "Confirm email",
    text: `http://localhost:3000/api/auth/register/email-verify?secret=${emailSecret}`,
  });
}

export function emailVerify(email: string): string {
  return generateAccessToken({
    email,
    id: 0,
    emailConfirmed: true,
  });
}

export async function signUp(cred: Credentials): Promise<[string, string]> {
  const mfaSecret = authenticator.generateKey();

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email: cred.email,
        password: await bcrypt.hash(cred.password, 10),
        mfaEnabled: false,
        mfaSecret: mfaSecret,
      },
    });
  } catch (error: any) {
    if (PrismaError.IsUnique(error)) {
      throw Errors.EMAIL_IS_NOT_UNIQUE;
    }

    throw error;
  }

  const uri = authenticator.generateTotpUri(
    mfaSecret,
    "john.doe@email.com",
    "ACME Co",
    "SHA1",
    6,
    30
  );

  return [
    await QRCode.toDataURL(uri),
    generateAccessToken({ email: cred.email, id: user.id, mfaEnabled: false }),
  ];
}

export async function mfaVerify(userId: number, code: number) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const rest = authenticator.verifyToken(user.mfaSecret, code);
  if (rest?.delta != 0) {
    throw Errors.BAD_MFA_CODE;
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      mfaEnabled: true,
    },
  });
}
