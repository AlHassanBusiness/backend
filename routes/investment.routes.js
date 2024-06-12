const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')
const {
    createInvestment,
    getAllInvestments,
} = require('../controllers/investment.controller')

router.get('/', protectedRoute, getAllInvestments)
router.post('/', protectedRoute, createInvestment)

module.exports = router
