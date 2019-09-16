const express = require('express')
const router = express.Router()
const KnowledgeControoler = require('../../controllers/knowledge/KnowledgeController')

router.get('/knowledge', KnowledgeControoler.getUncategorized)
router.get('/knowledge/all', KnowledgeControoler.getAll)
router.get('/knowledge/view/:id', KnowledgeControoler.getOne)
router.get('/knowledge/:id/file', KnowledgeControoler.getFile)
router.get('/knowledge/:id/files', KnowledgeControoler.getAllFiles)
router.get(
  '/knowledge/group/:groupName',
  KnowledgeControoler.getByKnowledgeGroup
)
router.post('/knowledge/', KnowledgeControoler.create)
router.put('/knowledge/:id', KnowledgeControoler.edit)
router.post('/knowledge/tempFile', KnowledgeControoler.addTempFile)
router.post('/knowledge/:id/file', KnowledgeControoler.addFile)
router.delete('/knowledge/:id', KnowledgeControoler.remove)

module.exports = router
