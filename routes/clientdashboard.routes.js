import express from 'express'
const router = express.Router()

import clientMiddle from '../middleware/clientmiddleware.js'

import {
    getStore,
    getProfitHistory,
    getInvestmentHistory,
} from '../controllers/clientdashboard.controller.js'

router.get('/', clientMiddle, getStore)
router.get('/profit-history', clientMiddle, getProfitHistory)
router.get('/investment-history', clientMiddle, getInvestmentHistory)

export default router
