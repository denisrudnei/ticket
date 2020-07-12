import express from 'express'
import { UploadedFile } from 'express-fileupload'
import CategoryService from '../../services/ticket/CategoryService'

export default {
  getImage: (req: express.Request, res: express.Response) => {
    CategoryService.getImage(parseInt(req.params.id))
      .then(response => {
        res.send(response)
      })
      .catch(() => {
        res.sendStatus(404)
      })
  },

  setImage: (req: express.Request, res: express.Response) => {
    CategoryService.setImage(parseInt(req.params.id), req.files!
      .image as UploadedFile).then(() => {
      res.sendStatus(202)
    })
  }
}
