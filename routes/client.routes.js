import express from 'express'
const router = express.Router()
import protectedRoute from '../middleware/protectRoute.js'
import {
    createClient,
    editClient,
    deleteClient,
    getClients,
    getClient,
    getDashboardDetails,
} from '../controllers/client.controller.js'

router.get('/', protectedRoute, getClients)
router.get('/:id', getClient)
router.post('/', protectedRoute, createClient)
router.put('/:id', protectedRoute, editClient)
router.delete('/:id', protectedRoute, deleteClient)
router.get('/dashboard/details', protectedRoute, getDashboardDetails)

export default router
