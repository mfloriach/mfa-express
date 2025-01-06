import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .preprocess(String, z.string())
    .refine((val) => val.length === 6, "must be 6 digit long")
    .transform(
      (c) => `${c.toString().substring(0, 3)} ${c.toString().substring(3)}`
    ),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const emailSchema = z.object({
  email: z.string().email(),
});
