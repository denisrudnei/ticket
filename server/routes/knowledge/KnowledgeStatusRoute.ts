import express from 'express'
const router = express.Router()
const KnowledgeStatusController = require('../../controllers/knowledge/KnowledgeStatusController')

router.get('/knowledge/status/', KnowledgeStatusController.getAll)

export default router
