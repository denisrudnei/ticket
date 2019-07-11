const CategoryService = require('../../services/ticket/CategoryService')

module.exports = app => {
  app.get('/category', (_, res) => {
    CategoryService.getCategories((err, result) => {
      if (err || result === null) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/category/:name', (req, res) => {
    CategoryService.getOne(req.params.name, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/category/:id/subs', (req, res) => {
    CategoryService.getSubsForCategory(req.params.id, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.post('/config/category', (req, res) => {
    CategoryService.create(req.body.name, req.body.father, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(201).json(result)
    })
  })
}
