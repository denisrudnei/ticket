import faker from 'faker'
import express from 'express'
import AuthService from '../../server/services/AuthService'
import Analyst from '../../server/models/Analyst'
import 'mocha'

const password = faker.internet.password()
const email = faker.internet.email()

const req = {
  protocol: 'http',
  hostname: '0.0.0.0'
} as express.Request

describe('Auth', function() {
  this.timeout(0)
  it('Register new user', async () => {
    const newUser = new Analyst({
      name: 'teste',
      email: email,
      password: password
    })
    await AuthService.register(newUser)
  })

  it('Register a existing user', async () => {
    const newUser = new Analyst({
      name: 'test',
      email: email,
      password: password
    })
    await AuthService.register(newUser).catch(() => {})
  })

  it('Login', async () => {
    await AuthService.login(email, password)
  })

  it('Login with incorrect email', async () => {
    try {
      await AuthService.login('incorrect', 'incorrect')
    } catch {}
  })

  it('Merge user', async () => {
    const analyst = await Analyst.findOne()
      .select('+email')
      .exec()
    const needMerge = analyst
    needMerge.name = '0000'
    await AuthService.mergeUser(analyst.email, needMerge)
  })

  it('Merge new user', async () => {
    const analyst = await Analyst.findOne()
      .select('+email')
      .exec()
    const needMerge = analyst
    delete needMerge._doc._id
    needMerge.name = '0000'
    await AuthService.mergeUser('newMail@mail.com', needMerge._doc)
  })

  it('Merge with external picture', async () => {
    const analyst = await Analyst.findOne()
      .select('+email')
      .exec()
    await Analyst.updateOne(
      {
        _id: analyst._id
      },
      {
        $set: {
          mergePictureWithExternalAccount: true
        }
      }
    )
    const needMerge = analyst
    delete needMerge._doc._id
    needMerge.name = '0000'
    await AuthService.mergeUser(analyst.email, needMerge._doc)
  })

  it('Reset password', async () => {
    const user = await Analyst.findOne({
      email: email
    })
      .select('+email')
      .exec()
    await AuthService.resetPassword(user._id, password, 'newPassword')
  })

  it('Reset password with incorrect password', async () => {
    const user = await Analyst.findOne({
      email: email
    })
      .select('+email')
      .exec()

    await AuthService.resetPassword(
      user._id,
      'incorrect password',
      'newPassword'
    ).catch(() => {})
  })

  it('Generate email to reset password', async () => {
    await AuthService.generateEmailToReset(email, req)
  })

  it('Reset with token', async () => {
    const token = await AuthService.generateEmailToReset(email, req)
    await AuthService.resetPasswordWithToken(token, 'new password')
  })
})
