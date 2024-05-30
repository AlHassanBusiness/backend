import express from 'express'
const router = express.Router()
import protectedRoute from '../middleware/protectRoute.js'

import {
    createInvestment,
    getAllInvestments,
} from '../controllers/investment.controller.js'

router.get('/', protectedRoute, getAllInvestments)
router.post('/', protectedRoute, createInvestment)

export default router
