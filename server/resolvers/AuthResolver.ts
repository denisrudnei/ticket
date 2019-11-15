const AuthService = require('../services/AuthService')

const AuthResolver = {
  Mutation: {
    Login: (_, { email, password }) => {
      return AuthService.login(email, password)
    }
  }
}

module.exports = AuthResolver
