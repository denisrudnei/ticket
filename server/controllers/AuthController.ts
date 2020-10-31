import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import AuthService from '~/server/services/AuthService';
import Analyst from '~/server/models/Analyst';

export default {
  login: (req: express.Request, res: express.Response) => {
    AuthService.login(req.body.email, req.body.password)
      .then((result) => {
        req.session!.authUser = result;
        const response = jsonwebtoken.sign(
          JSON.stringify(result),
          process.env.JWT_TOKEN as string,
        );
        return res.json({
          user: response,
        });
      })
      .catch(() => res.sendStatus(400));
  },

  getUser: (req: express.Request, res: express.Response) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const user = (jsonwebtoken.decode(token) as Analyst);
      res.json({
        user,
      });
    } else {
      res.sendStatus(401);
    }
  },

  logout: (req: express.Request, res: express.Response) => {
    delete req.session!.authUser;
    res.sendStatus(200);
  },

  register: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    } as Analyst;
    AuthService.register(user)
      .then(() => res.sendStatus(201))
      .catch(next);
  },

  mergeUser: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    AuthService.mergeUser(req.body.email, req.body)
      .then((result) => {
        req.session!.authUser = result;
        return res.status(200).json(result);
      })
      .catch((e: Error) => {
        next(e);
      });
  },

  redefinePassword: (req: express.Request, res: express.Response) => {
    const user = req.body;
    AuthService.generateEmailToReset(user.email, req)
      .then(() => res.sendStatus(200))
      .catch((err: Error) => res.status(500).json(err));
  },

  resetWithToken: (req: express.Request, res: express.Response) => {
    const user = req.body;
    const { token } = req.params;
    AuthService.resetPasswordWithToken(token, user.password)
      .then(() => res.sendStatus(200))
      .catch((err: Error) => res.status(500).json(err));
  },

  reset: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id;
    AuthService.resetPassword(
      userId,
      req.body.oldPassword,
      req.body.newPassword,
    )
      .then(() => res.sendStatus(201))
      .catch((e: Error) => res.status(400).json({
        message: 'Incorrect old password',
      }));
  },
};
