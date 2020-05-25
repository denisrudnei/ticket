import express from 'express'
import AddressService from '~/server/services/AddressService'

export default {
  create: (req: express.Request, res: express.Response) => {
    AddressService.create(req.body).then(() => {
      return res.sendStatus(200)
    })
  },

  getAll: (req: express.Request, res: express.Response) => {
    AddressService.getAll().then(addresses => {
      return res.status(200).json(addresses)
    })
  },

  getOne: (req: express.Request, res: express.Response) => {
    AddressService.getOne(parseInt(req.params.id)).then(address => {
      return res.status(200).json(address)
    })
  },

  edit: (req: express.Request, res: express.Response) => {
    AddressService.edit(parseInt(req.params.id), req.body).then(() => {
      res.sendStatus(202)
    })
  }
}
