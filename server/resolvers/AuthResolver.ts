import AuthService from '../services/AuthService'

const AuthResolver = {
  Mutation: {
    Login: (_: any, { email, password }: any) => {
      return AuthService.login(email, password)
    }
  }
}

export default AuthResolver
