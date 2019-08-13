const path = require('path')
const Email = require('email-templates')
const nodeMailer = require('nodemailer')

const transport = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

const email = new Email({
  juice: true,
  juiceResources: {
    preserveIportant: true,
    webResources: {
      relativeTo: path.join(__dirname, '..', '..', 'assets', 'mail')
    }
  },
  message: {
    from: process.env.MAIL_USER
  },
  transport: transport
})

const MailService = {
  sendConfirmationEmail(user, req, token) {
    return new Promise((resolve, reject) => {
      email
        .send({
          template: path.join(__dirname, '..', 'mails', 'reset'),
          locals: {
            name: user.name,
            url: `${req.protocol}://${
              req.hostname
            }/auth/redefinePassword/${token}`
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

module.exports = MailService
