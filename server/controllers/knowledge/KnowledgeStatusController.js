const knowledgeStatusService = require('../../services/knowledge/KnowledgeStatusService')

module.exports = app => {
  app.get('/knowledge/status/', (_, res) => {
    knowledgeStatusService.getAll((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}
