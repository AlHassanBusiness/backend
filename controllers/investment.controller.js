const Investment = require('../models/investment.model')
const Store = require('../models/store.model')
const Client = require('../models/client.model')

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
            .populate({
                path: 'client',
                select: '-password',
                populate: {
                  path: 'store'  
                }
              })
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
        const { client, amount } = req.body
        const foundClient = await Client.findById(client)
        if (foundClient) {
            await Store.updateOne(
                { _id: foundClient.store },
                { $inc: { totalprofit: amount } },
            )
            await Investment.create({ client, amount })
        }
        return res.status(201).json({
            message: 'Investment added',
        })
    } catch (error) {
        console.log('Error in create Investment controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getTotalInvestmentOfClient = async (req, res) => {
    try {
        const id= req.params.id;

        const investments = await Investment.find({client: id})

        let totalAmount =0
        for(let i = 0; i<investments.length ; i++) {
            totalAmount+= investments[i].amount
        }
        res.status(200).json({ totalAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = { getAllInvestments, createInvestment,getTotalInvestmentOfClient }
