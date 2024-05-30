import express from 'express'
const router = express.Router()
import protectedRoute from '../middleware/protectRoute.js'

import {
    createStore,
    deleteStore,
    getallstores,
} from '../controllers/store.controller.js'

router.post('/', protectedRoute, createStore)
router.get('/', protectedRoute, getallstores)
router.delete('/:id', protectedRoute, deleteStore)

export default router
