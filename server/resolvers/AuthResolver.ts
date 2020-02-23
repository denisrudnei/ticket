import { IResolvers } from 'graphql-tools'
import AuthService from '../services/AuthService'

const AuthResolver: IResolvers = {
  Mutation: {
    Login: (_: any, { email, password }: any) => {
      return AuthService.login(email, password)
    },
    MergeUser: (_: any, { email, user }: any) => {
      return AuthService.mergeUser(email, user)
    }
  }
}
export default AuthResolver
