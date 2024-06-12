const bcrypt = require('bcryptjs')
const Client = require('../models/client.model')
const Admin = require('../models/admin.model')
const {
    generateAdminTokenAndSetCookie,
    generateClientTokenAndSetCookie,
} = require('../utils/generateToken')

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const client = await Client.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(
            password,
            client?.password || '',
        )

        if (!client || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        generateClientTokenAndSetCookie(client._id, res)

        res.status(200).json({
            _id: client._id,
            username: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            bankname: client.bankname,
            accountno: client.accountno,
            accountholdername: client.accountholdername,
        })
    } catch (error) {
        console.log('Error in login controller', error.message)
        res.status(500).json({ error: error.message })
    }
}

const logout = (req, res) => {
    try {
        res.cookie('client_jwt', '', { maxAge: 0 })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log('Error in logout controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin?.password || '',
        )

        if (!admin || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        generateAdminTokenAndSetCookie(admin._id, res)

        const user = {
            _id: admin._id,
            username: admin.name,
            email: admin.email,
        }

        res.status(200).json(user)
    } catch (error) {
        console.log('Error in login controller', error.message)
        res.status(500).json({ error: error.message })
    }
}

const adminLogout = (req, res) => {
    try {
        res.cookie('admin_jwt', '', { maxAge: 0 })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log('Error in logout controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    login,
    logout,
    adminLogin,
    adminLogout,
}
