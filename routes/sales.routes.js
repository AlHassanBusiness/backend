const express = require('express')
const router = express.Router() 

const protectedRoute = require('../middleware/protectRoute')
const {getAllSalesOfClient,createSales,getAllSales} = require('../controllers/sales.controller')

router.get('/:clientID',getAllSalesOfClient) 
router.post('/',createSales)
router.get('/',getAllSales)

module.exports = router