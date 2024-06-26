const express = require('express')
const router = express.Router()
const { createAdmin, deleteAdmin } = require('../controllers/admin.controller')

router.post('/', createAdmin)
router.delete('/:id', deleteAdmin)

module.exports = router
