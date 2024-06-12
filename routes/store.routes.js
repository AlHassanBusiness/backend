const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')

const {
    createStore,
    deleteStore,
    getallstores,
} = require('../controllers/store.controller')

router.post('/', protectedRoute, createStore)
router.get('/', protectedRoute, getallstores)
router.delete('/:id', protectedRoute, deleteStore)

module.exports = router
