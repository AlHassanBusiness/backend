const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')
const {
    createClient,
    editClient,
    deleteClient,
    getClients,
    getClient,
    getDashboardDetails,
    getAllClients
} = require('../controllers/client.controller')

router.get('/', protectedRoute, getClients)
router.get('/allclients',protectedRoute,getAllClients)
router.get('/:id', getClient)
router.post('/', protectedRoute, createClient)
router.put('/:id', protectedRoute, editClient)
router.delete('/:id', protectedRoute, deleteClient)
router.get('/dashboard/details', protectedRoute, getDashboardDetails)

module.exports = router
