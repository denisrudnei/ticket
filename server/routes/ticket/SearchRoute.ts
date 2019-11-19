import express from 'express'
const router = express.Router()
import SearchController from '../../controllers/ticket/SearchController'

router.get('/search', SearchController.searchTicket)

export default router
