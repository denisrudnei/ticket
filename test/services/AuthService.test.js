const faker = require('faker')
const AuthService = require('../../server/services/AuthService')
const Analyst = require('../../server/models/Analyst')

const password = faker.internet.password()
const email = faker.internet.email()

describe('Auth', function() {
  this.timeout(0)
  it('Register new user', async () => {
    const newUser = {
      name: 'teste',
      email: email,
      password: password
    }
    await AuthService.register(newUser)
  })

  it('Register a existing user', async () => {
    const newUser = {
      name: 'teste',
      email: email,
      password: password
    }
    await AuthService.register(newUser).catch(() => {})
  })

  it('Login', async () => {
    await AuthService.login(email, password)
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
})
