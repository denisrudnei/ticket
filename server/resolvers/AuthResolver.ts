import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import AnalystInput from '../inputs/AnalystInput'
import Analyst from '../models/Analyst'
import AuthService from '../services/AuthService'

@Resolver()
class AuthResolver {
  @Mutation(() => Analyst)
  Login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() context: ExpressContext
  ) {
    const { req } = context
    return new Promise((resolve, reject) => {
      AuthService.login(email, password)
        .then(logged => {
          req!.session!.authUser = logged
          resolve(logged)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  @Mutation(() => Analyst)
  MergeUser(
    @Arg('email') email: string,
    @Arg('user', () => AnalystInput) user: Analyst
  ) {
    return AuthService.mergeUser(email, user)
  }

  @Mutation(() => Analyst)
  Register(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string
  ) {
    const user = Analyst.create({
      email,
      password,
      name
    })
    return AuthService.register(user)
  }

  @Mutation(() => Boolean)
  Logout(@Ctx() context: ExpressContext) {
    const { req } = context
    delete req!.session!.authUser
    return true
  }

  @Mutation(() => String)
  GenerateEmailToReset(
    @Arg('email') email: string,
    @Ctx() context: ExpressContext
  ): Promise<string> {
    return AuthService.generateEmailToReset(email, context.req)
  }

  @Mutation(() => Analyst)
  ResetPasswordWithToken(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string
  ): Promise<Analyst> {
    return AuthService.resetPasswordWithToken(token, newPassword)
  }
}
export default AuthResolver
