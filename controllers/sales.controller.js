const Sales = require('../models/sales.model') 
const Product = require('../models/product.model')
const DecidedProfit = require('../models/decidedprofit.model')


const getAllSalesOfClient = async(req,res) => {
    try {
        const clientId = req.params.clientID 

        // Get the current month and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month

        const sales = await Sales.find(
            {
            client: clientId,
            createdAt: {
                $gte: new Date(`${currentYear}-${currentMonth}-01`),
                $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
            }
        })
        .populate('product')
        .lean()

        return res.status(200).json({data: sales})

    } catch (error) {
        console.error("Error in getting sales of client",error.message)
        return res.status(500).json({error: error.message})
    }
}

const createSales = async(req,res) => {
    try {
        const {client,product,customer} = req.body

        if(!client || !product || !customer){
            return res.status(400).json({error: 'All fields are required'})
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month

        const existingSales = await Sales.find(
            {
                client: client,
                createdAt: {
                    $gte: new Date(`${currentYear}-${currentMonth}-01`),
                    $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
                }
        }).populate('product').lean()

        const decidedProfit = await DecidedProfit.findOne(
            {
                client: client,
                createdAt: {
                    $gte: new Date(`${currentYear}-${currentMonth}-01`),
                    $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
                }
            }
        )

        if(!decidedProfit){
            return res.status(400).json({error: "Profit was not decided for this client"})
        }

        let totalSumOfProductSalePrice = 0;

        for(let i= 0 ; i < existingSales.length ; i++){
            totalSumOfProductSalePrice+= existingSales[i].product.saleprice
        }

        const clientPrice = decidedProfit.to_client + 100

        if(totalSumOfProductSalePrice > clientPrice){
            return res.status(400).json({error: "You can't add more sales for this client, Limit Full!! "})
        }

        const incomingProduct = await Product.findById(product)

        if(incomingProduct.saleprice > decidedProfit.to_client){
            return res.status(400).json({
                error: 'Product price is greater than decided profit'
            })
        }

        const newSales = await Sales.create({
            client,
            product,
            customer
        })

        return res.status(201).json({data: newSales})

    } catch (error) {
        console.error("Error in creating sales ",error.message)
        return res.status(500).json({error: error.message})
    }
}


const getAllSales = async(req,res) => {
    try {

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month

        const sales = await Sales.find({
            createdAt: {
                $gte: new Date(`${currentYear}-${currentMonth}-01`),
                $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
            }
        }).populate(['client','product']).lean()

        return res.status(200).json({data: sales})

    } catch (error) {
        console.error("Error fetching all sales data",error.message)
        return res.status(500).json({error: error.message})
    }
}

module.exports = {
    getAllSalesOfClient,
    createSales,
    getAllSales
}