const dotenv = require("dotenv");
import { z } from "zod";

dotenv.config();

const common = z.object({
  TOKEN_SECRET: z.string(),
  DATABASE_URL: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  DB_URL: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
  REDIS_URL: z.string(),
});

const validate = common.safeParse(process.env);
if (validate.error) {
  console.log(validate.error);
  process.exit(0);
}

const { TOKEN_SECRET, DATABASE_URL, EMAIL_USER, EMAIL_PASS, REDIS_URL } =
  process.env;

export const config = {
  TOKEN_SECRET,
  DATABASE_URL,
  EMAIL_USER,
  EMAIL_PASS,
  REDIS_URL,
};
