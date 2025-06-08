import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Amin Aimeur" <${process.env.SMTP_USER}>`, // your gmail address
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('📧 Message sent: %s', info.messageId);
  // No preview URL here since it's a real SMTP server
}
