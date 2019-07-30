const KnowledgeService = require('../../services/knowledge/KnowledgeService')

module.exports = app => {
  app.get('/knowledge', (req, res) => {
    KnowledgeService.getUncategorized()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/knowledge/all', (_, res) => {
    KnowledgeService.getAll()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/knowledge/view/:id', (req, res) => {
    const id = req.params.id
    KnowledgeService.getOne(id)
      .then(knowledge => {
        return res.status(200).json(knowledge)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/knowledge/:id/file', (req, res) => {
    const id = req.params.id
    KnowledgeService.getFile(id)
      .then(file => {
        return res.end(file)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/knowledge/group/:groupName', (req, res) => {
    const groupName = req.params.groupName
    KnowledgeService.getByKnowledgeGroup(groupName)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/knowledge/', (req, res) => {
    const knowledge = req.body

    KnowledgeService.create(knowledge)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/knowledge/:id', (req, res) => {
    const knowledge = req.body

    KnowledgeService.updateKnowledge(req.params.id, knowledge)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/knowledge/:id/file', (req, res) => {
    const file = req.files.file
    const id = req.params.id
    KnowledgeService.addFile(id, file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/knowledge/:id', (req, res) => {
    const knowledgeId = req.params.id
    KnowledgeService.remove(knowledgeId)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
