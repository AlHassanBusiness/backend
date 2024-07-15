const Client = require('../models/client.model')
const DecidedProfit = require('../models/decidedprofit.model')


const createProfit = async (req, res) => {
    try {
        const { client, total_earning, to_client } = req.body;

        if (!client || !total_earning || !to_client) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Get the current month and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month

        // Check if there's already a decidedProfit for this client and current month
        const existingProfit = await DecidedProfit.findOne({
            client,
            createdAt: {
                $gte: new Date(`${currentYear}-${currentMonth}-01`),
                $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
            }
        });

        if (existingProfit) {
            return res.status(400).json({ error: 'Profit already decided for this client this month' });
        }

        // Create new DecidedProfit record
        const newProfit = await DecidedProfit.create({
            client,
            total_earning,
            to_client
        });

        if (newProfit) {
            return res.status(201).json({ data: 'Profit Decided' });
        }

        res.status(400).json({ error: 'Profit decision not successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};




module.exports = {
    createProfit
}