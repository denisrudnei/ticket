import express from 'express'
const AuthController = require('../controllers/AuthController')
const router = express.Router()

router.post('/auth/login', AuthController.login)
router.post('/auth/user', AuthController.getUser)
router.post('/auth/logout', AuthController.logout)
router.post('/auth/mergeUser', AuthController.mergeUser)
router.post('/auth/register', AuthController.register)
router.post('/auth/redefine', AuthController.redefinePassword)
router.post('/auth/password/reset', AuthController.reset)
router.post('/auth/redefine-password/:token', AuthController.resetWithToken)

export default router
