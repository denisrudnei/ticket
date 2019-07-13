const KnowledgeService = require('../../services/knowledge/KnowledgeService')

module.exports = app => {
  app.get('/knowledge', (req, res) => {
    KnowledgeService.getUncategorized((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/knowledge/all', (req, res) => {
    KnowledgeService.getAll((err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/knowledge/view/:id', (req, res) => {
    const id = req.params.id
    KnowledgeService.getOne(id, (err, knowledge) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(knowledge)
    })
  })

  app.get('/knowledge/:id/file', (req, res) => {
    const id = req.params.id
    KnowledgeService.getFile(id, (err, file) => {
      if (err) return res.status(500).json(err)
      return res.end(file)
    })
  })

  app.get('/knowledge/group/:groupName', (req, res) => {
    const groupName = req.params.groupName
    KnowledgeService.getByKnowledgeGroup(groupName, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.post('/knowledge/', (req, res) => {
    const knowledge = req.body

    KnowledgeService.create(knowledge, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(201).json(result)
    })
  })

  app.post('/knowledge/:id/file', (req, res) => {
    const file = req.files.file
    const id = req.params.id
    KnowledgeService.addFile(id, file, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })

  app.delete('/knowledge/:id', (req, res) => {
    const knowledgeId = req.params.id
    KnowledgeService.remove(knowledgeId, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })
}
