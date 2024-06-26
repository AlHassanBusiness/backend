const express = require('express')
const router = express.Router()
import { createAdmin, deleteAdmin } from '../controllers/admin.controller.js'

router.post('/', createAdmin)
router.delete('/:id', deleteAdmin)

module.exports = router
