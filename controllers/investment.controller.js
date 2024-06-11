import Investment from '../models/investment.model.js'
import Store from '../models/store.model.js'

export const getAllInvestments = async (req, res) => {
    try {
        const investments = await Investment.find()
            .sort({ createdAt: -1 })
            .lean()
            .populate('client', '-password')
            .populate('store')

        return res.status(200).json({
            data: investments,
        })
    } catch (error) {
        console.log('Error in get all investments controller', error.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const createInvestment = async (req, res) => {
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
