const Store = require('../models/store.model')

const createStore = async (req, res) => {
    try {
        const { name } = req.body
        const existingStore = await Store.findOne({ name: name })

        if (existingStore) {
            return res.status(401).json({
                error: 'Store with this name already exists',
            })
        }

        await Store.create({
            name: name,
        })

        return res.status(201).json({
            message: 'Store created successfully',
        })
    } catch (error) {
        console.log('Error in get store controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getallstores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 })

        return res.status(200).json({
            data: stores,
        })
    } catch (error) {
        console.log('Error in get store controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const deleteStore = async (req, res) => {
    try {
        const { id } = req.params
        const store = await Store.findById(id)
        if (!store) {
            return res.status(400).json({
                error: 'Store not found',
            })
        }

        await Store.findByIdAndDelete(id)

        return res.status(200).json({
            message: 'Store deleted',
        })
    } catch (error) {
        console.log('Error in delete  store contorller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    createStore,
    getallstores,
    deleteStore,
}
