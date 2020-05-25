import express from 'express'
import RoleService from '../services/RoleService'

export default {
  getAll: (req: express.Request, res: express.Response) => {
    RoleService.getRoles()
      .then(roles => {
        return res.status(200).json(roles)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  updateRole: (req: express.Request, res: express.Response) => {
    RoleService.updateRole(req.params!.id as any, req.body)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  setAnalystRole: (req: express.Request, res: express.Response) => {
    RoleService.setAnalystRole(parseInt(req.params.id), req.body.name)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
