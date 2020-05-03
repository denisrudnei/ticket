import express from 'express'
import { UploadedFile } from 'express-fileupload'
import CategoryService from '../../services/ticket/CategoryService'
import Category, { ICategory } from '../../models/ticket/Category'
export default {
  getCategories: (_: express.Request, res: express.Response) => {
    CategoryService.getCategories()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    CategoryService.getOne(req.params.name)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getSubs: (req: express.Request, res: express.Response) => {
    CategoryService.getSubsForCategory(req.params!.id as ICategory['_id'])
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    CategoryService.edit(req.params!.id as ICategory['_id'], req.body).then(
      () => {
        return res.sendStatus(202)
      }
    )
  },

  getImage: (req: express.Request, res: express.Response) => {
    CategoryService.getImage(req.params.id)
      .then(response => {
        res.send(response.Body)
      })
      .catch(() => {
        res.sendStatus(404)
      })
  },

  setImage: (req: express.Request, res: express.Response) => {
    CategoryService.setImage(req.params.id, req.files!
      .image as UploadedFile).then(() => {
      res.sendStatus(202)
    })
  },

  create: (req: express.Request, res: express.Response) => {
    const category = new Category({
      name: req.body.name,
      father: req.body.father,
      fields: req.body.fields
    })
    CategoryService.create(category)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
