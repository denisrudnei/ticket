const KnowledgeService = require('../../services/knowledge/KnowledgeService')

module.exports = {
  getUnCategorized: (req, res) => {
    KnowledgeService.getUnCategorized()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getAll: (_, res) => {
    KnowledgeService.getAll()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getOne: (req, res) => {
    const id = req.params.id
    KnowledgeService.getOne(id)
      .then(knowledge => {
        return res.status(200).json(knowledge)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getFile: (req, res) => {
    const id = req.params.id
    KnowledgeService.getFile(id)
      .then(file => {
        return res.end(file)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getAllFiles: (req, res) => {
    const id = req.params.id
    KnowledgeService.getAllFiles(id)
      .then(file => {
        return res.end(file)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  getByKnowledgeGroup: (req, res) => {
    const groupName = req.params.groupName
    KnowledgeService.getByKnowledgeGroup(groupName)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  create: (req, res) => {
    const knowledge = req.body

    KnowledgeService.create(knowledge)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  edit: (req, res) => {
    const knowledge = req.body

    KnowledgeService.updateKnowledge(req.params.id, knowledge)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  addTempFile: (req, res) => {
    const file = req.files.file
    KnowledgeService.addTempFile(file)
      .then(data => {
        return res.status(201).json(data)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  addFile: (req, res) => {
    const file = req.files.file
    const id = req.params.id
    KnowledgeService.addFile(id, file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  },

  remove: (req, res) => {
    const knowledgeId = req.params.id
    KnowledgeService.remove(knowledgeId)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  }
}
