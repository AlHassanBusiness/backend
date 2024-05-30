import express from 'express'
const router = express.Router()
import protectedRoute from '../middleware/protectRoute.js'
import { createProfit } from '../controllers/profit.controller.js'

router.post('/', protectedRoute, createProfit)

export default router
