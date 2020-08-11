import Email from 'email-templates';
import express from 'express';
import nodeMailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';

import Analyst from '../models/Analyst';

const transport = nodeMailer.createTransport(
  new SMTPTransport({
    host: process.env.MAIL_HOST as string,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  }),
);

const email = new Email({
  juice: true,
  preview: false,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.join(__dirname, '..', '..', 'assets', 'mail'),
    },
  },
  message: {
    from: process.env.MAIL_USER,
  },
  transport,
});

class MailService {
  static async sendConfirmationEmail(
    user: Analyst,
    req: express.Request,
    token: string,
  ): Promise<void> {
    await email
      .send({
        template: path.join(__dirname, '..', 'mails', 'reset'),
        locals: {
          name: user.name,
          url: `${req.protocol}://${req.hostname}/auth/redefine-password/${token}`,
        },
        message: {
          to: user.email,
          subject: 'Password reset',
        },
      });
  }
}

export default MailService;
