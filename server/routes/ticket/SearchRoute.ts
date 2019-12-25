import express from 'express'
import SearchController from '../../controllers/ticket/SearchController'
const router = express.Router()

router.get('/search', SearchController.searchTicket)

export default router
