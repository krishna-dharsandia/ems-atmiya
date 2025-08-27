import { transporter } from "@/lib/nodeMailerConfig";
import { Attachment } from "nodemailer/lib/mailer";

export interface SendMailProps {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export async function sendMail(props: SendMailProps) {
  await transporter.sendMail({
    from: "Atmiya University - EMS",
    to: props.to,
    subject: props.subject,
    html: props.html,
    attachments: props.attachments,
  })
}
