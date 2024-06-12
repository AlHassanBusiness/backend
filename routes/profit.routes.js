const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')

const { createProfit } = require('../controllers/profit.controller')

router.post('/', protectedRoute, createProfit)

module.exports = router
