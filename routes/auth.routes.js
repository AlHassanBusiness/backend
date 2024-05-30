import express from 'express'
const router = express.Router()
import {
    login,
    logout,
    adminLogin,
    adminLogout,
} from '../controllers/auth.controller.js'

router.post('/login', login)
router.post('/logout', logout)
router.post('/admin/login', adminLogin)
router.post('/admin/logout', adminLogout)

export default router
