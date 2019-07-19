const faker = require('faker')
const AuthService = require('../../server/services/AuthService')

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

  it('Login', async () => {
    await AuthService.login(email, password)
  })
})
