const express = require('express')
const router = express.Router()
const {
    login,
    logout,
    adminLogin,
    adminLogout,
} = require('../controllers/auth.controller')

router.post('/login', login)
router.post('/logout', logout)
router.post('/admin/login', adminLogin)
router.post('/admin/logout', adminLogout)

module.exports = router
