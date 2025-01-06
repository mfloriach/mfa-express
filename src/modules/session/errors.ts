import { Request, Response, NextFunction } from "express";

export const Errors = {
  USER_NOT_EXIST: new Error("user does not exist"),
  INCORRECT_PASSWORD: new Error("password is incorrect"),
  BAD_MFA_CODE: new Error("mfa code was incorrect"),
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
    case Errors.USER_NOT_EXIST:
      status = 401;
      msg = error.message;
      break;
    case Errors.BAD_MFA_CODE:
      status = 401;
      msg = error.message;
      break;
    case Errors.INCORRECT_PASSWORD:
      status = 400;
      msg = error.message;
      break;
    default:
      console.log(error);
  }

  res.status(status).json(msg);
};
