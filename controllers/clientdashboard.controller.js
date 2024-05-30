import Client from '../models/client.model.js'
import Store from '../models/store.model.js'
import Investment from '../models/investment.model.js'
import Profit from '../models/profit.model.js'

export const getStore = async (req, res) => {
    try {
        const client = req.client
        if (client) {
            const investment = await Investment.findOne({ client: client._id })
                .lean()
                .populate('store')
                .exec()
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
            const allProfit = await Profit.find({
                client: client._id,
            })
                .select(['-client', '-store'])
                .limit(10)
                .sort({ createdAt: -1 })
            const profitAmount = profit.length > 0 ? profit[0].amount : 0
            if (investment) {
                return res.status(200).json({
                    data: investment,
                    profit: profitAmount,
                    profitHistory: allProfit,
                })
            } else {
                console.log('Store not found')
                return res.status(404).json({
                    error: 'Store not found',
                })
            }
        } else {
            console.log('Client not found in request')
            return res.status(400).json({
                error: 'Client not found',
            })
        }
    } catch (error) {
        console.log('Error in get store controller client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}

export const getProfitHistory = async (req, res) => {
    try {
        const client = req.client
        const profits = await Profit.find({ client: client._id })
            .sort({
                createdAt: -1,
            })
            .select(['-store', '-client'])

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
        const investments = await Investment.find({
            client: client._id,
        })
            .select('-client')
            .populate('store')

        return res.status(200).json({
            data: investments,
        })
    } catch (error) {
        console.log('Error in get investments client side', error.message)
        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}
