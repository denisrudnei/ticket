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

  app.post('/config/category', (req, res) => {
    CategoryService.create(req.body.name, req.body.father)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
