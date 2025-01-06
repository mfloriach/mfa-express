const Queue = require("bull");
import { sendMail, Mail } from "@utils/email";
import { config } from "@config";

const emailQueue = new Queue("emailQueue", `redis://${config.REDIS_URL}:6379`);

export function sendEmail(data: Mail) {
  emailQueue.add(data);
}

emailQueue.process(async (job: any) => {
  try {
    await sendMail(job.data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
});
