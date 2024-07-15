const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/clientmiddleware')
const {
    getClientProfile,
    getStore,
    getProfitHistory,
    getInvestmentHistory,
    getClientSales
} = require('../controllers/clientdashboard.controller')

router.get('/', protectedRoute, getStore)
router.get('/profit-history', protectedRoute, getProfitHistory)
router.get('/investment-history', protectedRoute, getInvestmentHistory)
router.get('/profile-details', protectedRoute, getClientProfile)
router.get('/salesHistory',protectedRoute,getClientSales)

module.exports = router
