const express = require('express')
const router = express.Router()
const KnowledgeStatusController = require('../../controllers/knowledge/KnowledgeStatusController')

router.get('/knowledge/status/', KnowledgeStatusController.getAll)

module.exports = router
