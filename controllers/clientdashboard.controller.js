const Investment = require('../models/investment.model')
const Profit = require('../models/profit.model')
const DecidedProfit = require('../models/decidedprofit.model')
const Sales = require('../models/sales.model')

const getStore = async (req, res) => {
    try {
        const client = req.client
        if (client) {
            const investments = await Investment.find({ client: client._id })
                .lean()
                .exec()

            const totalInvestment = investments.reduce(
                (sum, inv) => sum + inv.amount,
                0,
            )

            // Get the current month and year
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month

            const decidedProfit =await DecidedProfit.findOne(
                    {
                        client: client._id,
                        createdAt: {
                        $gte: new Date(`${currentYear}-${currentMonth}-01`),
                        $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
                    }
                }
            )

            const salesHistory = await Sales.find(
                {
                    client: client._id,
                    createdAt: {
                        $gte: new Date(`${currentYear}-${currentMonth}-01`),
                        $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
                    }
                }
            ).populate('product').limit(5).lean()


            const sales = decidedProfit?.to_client

            const profit = await Profit.aggregate([
                {
                    $match: {
                        client: client._id,
                        createdAt: {
                            $gte: new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                1,
                            ),
                            $lt: new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() + 1,
                                1,
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: '$amount' },
                    },
                },
            ])

            const profitAmount = profit.length > 0 ? profit[0].amount : 0

            return res.status(200).json({
                totalInvestment,
                profit: profitAmount,
                sales,
                salesHistory
            })
        } else {
            console.log('Client not found in request')
            return res.status(400).json({ error: 'Client not found' })
        }
    } catch (error) {
        console.log('Error in get store controller client side', error.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getProfitHistory = async (req, res) => {
    try {
        const client = req.client
        let page = parseInt(req.query.page) || 0
        let resultsPerPage = 20
        const totalProfits = await Profit.countDocuments({
            client: client._id,
        })

        const profits = await Profit.find({ client: client._id })
            .sort({
                createdAt: -1,
            })
            .select('-client')
            .populate('store')
            .limit(resultsPerPage)
            .skip(page * resultsPerPage)

        return res.status(200).json({
            data: profits,
            total: totalProfits,
        })
    } catch (error) {
        console.log('Error in get profit history client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}

const getInvestmentHistory = async (req, res) => {
    try {
        const client = req.client
        let page = parseInt(req.query.page) || 0
        const resultsPerPage = 20

        // Fetch the total count of investments for pagination
        const totalInvestments = await Investment.countDocuments({
            client: client._id,
        })

        // Fetch investments for the current page
        const investments = await Investment.find({ client: client._id })
            .select(['-client'])
            .sort({ createdAt: -1 })
            .limit(resultsPerPage)
            .skip(page * resultsPerPage)

        let cumulativeAmount = 0
        const investmentHistory = investments.map((investment) => {
            cumulativeAmount += investment.amount
            return {
                ...investment.toObject(),
                cumulativeAmount,
            }
        })

        return res.status(200).json({
            data: investmentHistory,
            total: totalInvestments,
        })
    } catch (error) {
        console.log('Error in get investments client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}

const getClientProfile = async (req, res) => {
    try {
        const client = req.client

        return res.status(200).json({
            data: client,
        })
    } catch (error) {
        console.log('Error in get client profile client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}

const getClientSales = async(req,res) => {
        try {
            const requestClient = req.client
    
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month
    
            const sales = await Sales.find(
                {
                client: requestClient._id,
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

module.exports = {
    getStore,
    getProfitHistory,
    getInvestmentHistory,
    getClientProfile,
    getClientSales
}
