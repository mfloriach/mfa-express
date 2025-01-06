const nodemailer = require("nodemailer");
import { config } from "@config/index";

export interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export async function sendMail(mail: Mail) {
  await transporter.sendMail(mail);
}
