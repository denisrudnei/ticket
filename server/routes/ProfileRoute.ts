import express from 'express'
const router = express.Router()
import ProfileController from '../controllers/ProfileController'

router.get('/profile', ProfileController.getProfileInfo)
router.get('/info/path', ProfileController.getPaths)
router.get('/info/path/refs', ProfileController.getRefs)
router.post('/info/path', ProfileController.createPath)
router.get('/profile/address', ProfileController.getAddress)
router.delete('/info/path/:id', ProfileController.remove)

export default router
