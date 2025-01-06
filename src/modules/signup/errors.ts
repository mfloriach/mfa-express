import { Request, Response, NextFunction } from "express";

export const Errors = {
  BAD_MFA_CODE: new Error("mfa code was incorrect"),
  EMAIL_IS_NOT_UNIQUE: new Error("email must be unique"),
};

export const ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let msg = "internal error";
  let status = 500;

  switch (error) {
    case Errors.BAD_MFA_CODE:
      status = 401;
      msg = error.message;
      break;
    case Errors.EMAIL_IS_NOT_UNIQUE:
      status = 400;
      msg = error.message;
      break;
    default:
      console.log(error);
  }

  res.status(status).json(msg);
};
