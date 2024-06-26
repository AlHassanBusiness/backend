const Investment = require('../models/investment.model')
const Store = require('../models/store.model')

const getAllInvestments = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 0
        const resultsPerPage = 20

        // Fetch the total count of investments for pagination
        const totalInvestments = await Investment.countDocuments({})

        // Fetch investments for the current page
        const investments = await Investment.find()
            .sort({ createdAt: -1 })
            .lean()
            .populate('client', '-password')
            .populate('store')
            .limit(resultsPerPage)
            .skip(page * resultsPerPage)

        return res.status(200).json({
            data: investments,
            total: totalInvestments,
        })
    } catch (error) {
        console.log('Error in get all investments controller', error.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const createInvestment = async (req, res) => {
    try {
        const { client, store, amount } = req.body
        const foundStore = await Store.findById(store)
        if (foundStore) {
            await Store.updateOne(
                { _id: store },
                { $inc: { totalprofit: amount } },
            )
            await Investment.create({ client, store, amount })
        }
        return res.status(201).json({
            message: 'Investment added',
        })
    } catch (error) {
        console.log('Error in create Investment controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = { getAllInvestments, createInvestment }
