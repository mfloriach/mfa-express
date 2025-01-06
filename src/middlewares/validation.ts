import { NextFunction, Request, Response } from "express";

export const validateBody =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validate = schema.safeParse(req.body);
    if (validate.error) {
      res.status(400).send(validate.error.issues);
      return;
    }

    req.body = validate.data;

    next();
  };
