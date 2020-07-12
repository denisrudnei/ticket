import faker from 'faker'
import express from 'express'
import AuthService from '../../server/services/AuthService'
import Analyst from '../../server/models/Analyst'
import Role from '~/server/models/Role'
const password = 'password'
const email = 'testUser'

const req = {
  protocol: 'http',
  hostname: '0.0.0.0'
} as express.Request

describe('Auth', function() {
  it('Register new user', async () => {
    const newUser = Analyst.create()
    newUser.name = 'testRegister'
    newUser.email = faker.internet.email()
    newUser.password = password
    await AuthService.register(newUser)
  })

  it('Register a existing user', async () => {
    const newUser = await Analyst.findOne()
    newUser!.name = 'test'
    newUser!.email = email
    newUser!.password = password

    await AuthService.register(newUser!).catch(() => {})
  })

  it('Login', async () => {
    const newUser = new Analyst()
    newUser.name = 'testLogin'
    newUser.email = faker.internet.email()
    newUser.role = (await Role.findOne()) as Role
    newUser.password = password
    await newUser.save()
    await AuthService.login(email, password)
  })

  it('Login with incorrect email', async () => {
    try {
      await AuthService.login('incorrect', 'incorrect')
    } catch {}
  })

  it('Merge user', async () => {
    const analyst = await Analyst.findOne()

    const needMerge = analyst
    needMerge!.name = '0000'
    await AuthService.mergeUser(analyst!.email, needMerge!)
  })

  it('Merge new user', async () => {
    const analyst = await Analyst.findOne()

    const needMerge = analyst
    // delete needMerge.id
    needMerge!.name = '0000'
    await AuthService.mergeUser('newMail@mail.com', needMerge!)
  })

  it('Merge with external picture', async () => {
    const analyst = await Analyst.findOne()

    // await Analyst.update(
    //   {
    //     mergePictureWithExternalAccount: true
    //   },
    //   {
    //     where: {
    //       id: analyst.id
    //     }
    //   }
    // )
    const needMerge = analyst
    delete needMerge!.id
    needMerge!.name = '0000'
    await AuthService.mergeUser(analyst!.email, needMerge!)
  })

  it('Reset password', async () => {
    const user = await Analyst.findOne({ email: email })

    await AuthService.resetPassword(user!.id, password, 'newPassword')
  })

  it('Reset password with incorrect password', async () => {
    const user = await Analyst.findOne({
      where: { email: email }
    })

    await AuthService.resetPassword(
      user!.id,
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
