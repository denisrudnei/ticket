import path from  'path'
import Email from  'email-templates'
import nodeMailer from 'nodemailer'
import { IAnalyst } from '../models/Analyst'
import express from 'express'
import {} from 'jsonwebtoken'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const transport = nodeMailer.createTransport(new SMTPTransport({
  host: process.env.MAIL_HOST as string,
  port: parseInt(process.env.MAIL_PORT as string),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
}))

const email = new Email({
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.join(__dirname, '..', '..', 'assets', 'mail')
    }
  },
  message: {
    from: process.env.MAIL_USER
  },
  transport: transport
})

class MailService {
  sendConfirmationEmail(user: IAnalyst, req: express.Request, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      email
        .send({
          template: path.join(__dirname, '..', 'mails', 'reset'),
          locals: {
            name: user.name,
            url: `${req.protocol}://${
              req.hostname
            }/auth/redefine-password/${token}`
          },
          message: {
            to: user.email,
            subject: 'Password reset'
          }
        })
        .then(resolve)
        .catch(reject)
    })
  }
}

export default new MailService()
