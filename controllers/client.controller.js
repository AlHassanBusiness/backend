const Client = require('../models/client.model')
const companySchema = require('../validations/company.schema')
const Investment = require('../models/investment.model')
const Store = require('../models/store.model')
const bcrypt = require('bcryptjs')

const getClients = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 0
        let resultsPerPage = 10
        const totalClients = await Client.countDocuments({})
        const clients = await Client.find({})
            .sort({ createdAt: 'descending' })
            .lean()
            .limit(resultsPerPage)
            .skip(page * resultsPerPage)
            .select('-password')

        res.status(200).json({ data: clients, total: totalClients })
    } catch (error) {
        console.log('Error in get clients controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).select('-password')

        if (!client) {
            return res.status(404).json({ error: 'Client not found' })
        }

        const investments = await Investment.find({ client: client._id })
            .populate('store')
            .populate('amount')

        res.status(200).json({ data: { client, investments } })
    } catch (error) {
        console.log('Error in get client controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const createClient = async (req, res) => {
    try {
        const value = await companySchema
            .validateAsync(req.body)
            .then(() => {
                return true
            })
            .catch((error) => {
                return res.status(400).json({ error: error.details[0].message })
            })

        if (value === true) {
            const client = await Client.findOne({
                email: req.body.email,
            })

            if (client) {
                return res
                    .status(400)
                    .json({ error: 'Username or email already exists' })
            }

            // HASH PASSWORD HERE
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const newClient = new Client({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                address: req.body.address,
                bankname: req.body.bankname,
                accountno: req.body.accountno,
                accountholdername: req.body.accountholdername,
            })

            if (newClient) {
                await newClient.save()

                res.status(201).json({
                    message: 'Client created successfully',
                })
            } else {
                res.status(400).json({ error: 'Invalid data entered' })
            }
        }
    } catch (error) {
        console.log('Error in signup controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const editClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ error: 'Client not found' })
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                bankname: req.body.bankname,
                accountno: req.body.accountno,
                accountholdername: req.body.accountholdername,
            },
            { new: true },
        )

        res.status(200).json({
            message: 'Client updated successfully',
        })
    } catch (error) {
        console.log('Error in edit client controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)

        if (!client) {
            return res.status(404).json({ error: 'Client not found' })
        }

        await Client.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: 'Client deleted successfully',
        })
    } catch (error) {
        console.log('Error in delete client controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getDashboardDetails = async (req, res) => {
    try {
        const totalClients = await Client.countDocuments({})
        const totalStores = await Store.countDocuments({})
        const totalInvestments = await Investment.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                },
            },
        ])

        res.status(200).json({
            totalClients,
            totalStores,
            totalInvestments:
                totalInvestments.length > 0
                    ? totalInvestments[0].totalAmount
                    : 0,
        })
    } catch (error) {
        console.log('Error in get dashboard details controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getClients,
    getClient,
    createClient,
    editClient,
    deleteClient,
    getDashboardDetails,
}
