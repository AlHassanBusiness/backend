const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')
const {
    createInvestment,
    getAllInvestments,
    getTotalInvestmentOfClient,
} = require('../controllers/investment.controller')

router.get('/', protectedRoute, getAllInvestments)
router.post('/', protectedRoute, createInvestment)
router.get('/totalinvestment/:id',protectedRoute,getTotalInvestmentOfClient)

module.exports = router
