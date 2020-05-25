import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import AuthService from '../services/AuthService'
import Analyst from '../models/Analyst'
import AnalystInput from '../inputs/AnalystInput'

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
}
export default AuthResolver
