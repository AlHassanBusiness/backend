const jwt = require('jsonwebtoken')
const Admin = require('../models/admin.model')

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.admin_jwt

        if (!token) {
            console.log('No token provided')
            return res
                .status(401)
                .json({ error: 'Unauthorized - No Token Provided' })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decodedToken) => {
                if (err) {
                    console.log('Token verification failed:', err.message)
                    return res
                        .status(401)
                        .json({ error: 'Unauthorized - Invalid Token' })
                }
                return decodedToken
            },
        )
        if (!decoded) {
            console.log('Invalid token')
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid Token' })
        }

        const admin = await Admin.findById(decoded.userId).select('-password')

        if (!admin) {
            console.log('Admin not found')
            return res.status(404).json({ error: 'Unauthorized' })
        }

        req.admin = admin
        next()
    } catch (error) {
        console.log('Error in protectRoute middleware:', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = protectRoute
