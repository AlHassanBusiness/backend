const express = require('express')
const router = express.Router()
const protectedRoute = require('../middleware/protectRoute')
const {createProduct,getAllProductsOfStore,deleteProduct,getProducts}  = require('../controllers/product.controller')


router.get('/:id',protectedRoute,getAllProductsOfStore)
router.post('/',protectedRoute,createProduct) 
router.delete('/:id',protectedRoute,deleteProduct)
router.get('/',protectedRoute,getProducts)

module.exports = router 