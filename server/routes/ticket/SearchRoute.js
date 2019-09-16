const express = require('express')
const router = express.Router()
const SearchController = require('../../controllers/ticket/SearchController')

router.get('/search', SearchController.searchTicket)

module.exports = router
