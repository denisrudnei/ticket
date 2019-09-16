const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/ProfileController')

router.get('/profile', ProfileController.getProfileInfo)
router.get('/info/path', ProfileController.getProfileInfo)
router.get('/info/path/refs', ProfileController.getRefs)
router.post('/info/path', ProfileController.getProfileInfo)
router.get('/profile/address', ProfileController.getProfileInfo)
router.delete('/info/path/:id', ProfileController.getProfileInfo)

module.exports = router
