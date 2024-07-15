const Profit = require('../models/profit.model')

const createProfit = async (req, res) => {
    try {
        const { client, amount } = req.body

        const newProfit = new Profit({
            client,
            amount
        })
        await newProfit.save()
        return res.status(201).json({
            message: 'Profit added',
        })
    } catch (error) {
        console.log('Error in profit create controller', error.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { createProfit }
