const knowledgeStatusService = require('../../services/knowledge/KnowledgeStatusService')

module.exports = {
  getAll: (_, res) => {
    knowledgeStatusService
      .getAll()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  }
}
