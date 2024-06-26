const Investment = require('../models/investment.model')
const Profit = require('../models/profit.model')
const Client = require('../models/client.model')

const getStore = async (req, res) => {
    try {
        const client = req.client
        if (client) {
            const investments = await Investment.find({ client: client._id })
                .populate('store')
                .lean()
                .exec()

            const totalInvestment = investments.reduce(
                (sum, inv) => sum + inv.amount,
                0,
            )

            const firstStoreName =
                investments.length > 0 ? investments[0].store.name : null

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

            const allProfit = await Profit.find({ client: client._id })
                .select('-client')
                .populate('store')
                .limit(10)
                .sort({ createdAt: -1 })
                .lean()
                .exec()

            const profitAmount = profit.length > 0 ? profit[0].amount : 0

            return res.status(200).json({
                totalInvestment,
                firstStoreName,
                profit: profitAmount,
                profitHistory: allProfit,
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

module.exports = {
    getStore,
    getProfitHistory,
    getInvestmentHistory,
    getClientProfile,
}
