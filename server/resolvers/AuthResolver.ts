import AuthService from '../services/AuthService'
import {IResolvers} from 'graphql-tools'

const AuthResolver: IResolvers = {
  Mutation:  {
    Login: (_: any, { email, password }: any) => {
      return AuthService.login(email, password)
    }
  }
}
export default AuthResolver
