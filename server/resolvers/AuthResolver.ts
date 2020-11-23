/* eslint-disable class-methods-use-this */
import {
  Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from 'type-graphql';

import { Raw } from 'typeorm';
import { CustomExpressContext } from '~/server/types/UserSession';
import AnalystMergeInput from '../inputs/AnalystMergeInput';
import Analyst from '../models/Analyst';
import AuthService from '../services/AuthService';

@Resolver()
class AuthResolver {
  @Mutation(() => Analyst)
  async Login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const logged = await AuthService.login(email, password);

    req!.session!.authUser = logged;

    return logged;
  }

  @Query(() => Analyst)
  @Authorized('user')
  async GetLogged(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    const logged = await Analyst.findOne(id);
    return logged;
  }

  // FIXME
  @Mutation(() => Analyst)
  @Authorized('user')
  async MergeUser(
    @Arg('email') email: string,
    @Arg('user', () => AnalystMergeInput) user: Analyst,
    @Ctx() { req }: CustomExpressContext,
  ) {
    req!.session!.authUser = await Analyst.findOne({
      where: {
        email: Raw((alias) => `${alias} ILIKE '%${email}%'`),
      },
      relations: ['role'],
    });

    return AuthService.mergeUser(email, user);
  }

  @Mutation(() => Analyst)
  Register(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string,
  ) {
    const user = Analyst.create({
      email,
      password,
      name,
    });
    return AuthService.register(user);
  }

  @Mutation(() => Boolean)
  Logout(@Ctx() context: CustomExpressContext) {
    const { req } = context;
    delete req!.session!.authUser;
    return true;
  }

  @Mutation(() => String)
  GenerateEmailToReset(
    @Arg('email') email: string,
    @Ctx() context: CustomExpressContext,
  ): Promise<string> {
    return AuthService.generateEmailToReset(email, context.req);
  }

  @Mutation(() => Boolean)
  ResetPassword(
    @Arg('newPassword') newPassword: string,
    @Arg('oldPassword') oldPassword: string,
    @Ctx() context: CustomExpressContext,
  ) {
    const userId = context.req!.session!.authUser!.id;
    return AuthService.resetPassword(userId, oldPassword, newPassword);
  }

  @Mutation(() => Analyst)
  ResetPasswordWithToken(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
  ): Promise<Analyst> {
    return AuthService.resetPasswordWithToken(token, newPassword);
  }
}
export default AuthResolver;
