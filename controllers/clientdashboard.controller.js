import Client from '../models/client.model.js'
import Store from '../models/store.model.js'
import Investment from '../models/investment.model.js'
import Profit from '../models/profit.model.js'

export const getStore = async (req, res) => {
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
                investments.length > 0
                    ? investments[0].store.name
                    : 'No Store Found'

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

export const getProfitHistory = async (req, res) => {
    try {
        const client = req.client
        const profits = await Profit.find({ client: client._id })
            .sort({
                createdAt: -1,
            })
            .select('-client')
            .populate('store')

        return res.status(200).json({
            data: profits,
        })
    } catch (error) {
        console.log('Error in get profit history client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}

export const getInvestmentHistory = async (req, res) => {
    try {
        const client = req.client

        // Fetch all investments of the client
        const investments = await Investment.find({
            client: client._id,
        })
            .select(['-client', '-store'])
            .sort({ createdAt: 1 })

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
        })
    } catch (error) {
        console.log('Error in get investments client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}
