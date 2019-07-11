const KnowledgeCategoryService = require('../../services/knowledge/KnowledgeCategoryService')

module.exports = app => {
  app.get('/knowledge/category', (_, res) => {
    KnowledgeCategoryService.getCategories((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/knowledge/category/:id', (req, res) => {
    const id = req.params.id
    KnowledgeCategoryService.getCategory(id, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.post('/knowledge/category', (req, res) => {
    const { name } = req.body
    const category = {
      name: name
    }
    KnowledgeCategoryService.create(category, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })
}
