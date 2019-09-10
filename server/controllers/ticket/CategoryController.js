const CategoryService = require('../../services/ticket/CategoryService')

module.exports = app => {
  app.get('/category', (_, res) => {
    CategoryService.getCategories()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/category/:name', (req, res) => {
    CategoryService.getOne(req.params.name)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/category/:id/subs', (req, res) => {
    CategoryService.getSubsForCategory(req.params.id)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/category/:id/', (req, res) => {
    CategoryService.edit(req.params.id, req.body).then(() => {
      return res.sendStatus(202)
    })
  })

  app.post('/config/category', (req, res) => {
    const category = {
      name: req.body.name,
      father: req.body.father,
      fields: req.body.fields
    }
    CategoryService.create(category)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
