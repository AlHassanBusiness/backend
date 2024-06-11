import jwt from 'jsonwebtoken'
import Client from '../models/client.model.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.client_jwt
        if (!token) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - No Token Provided' })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid Token' })
        }

        if (!decoded) {
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid Token' })
        }

        const client = await Client.findById(decoded.userId).select('-password')

        if (!client) {
            return res
                .status(404)
                .json({ error: 'Unauthorized - Client Not Found' })
        }

        req.client = client
        next()
    } catch (error) {
        console.error('Error in protectRoute middleware: ', error.message)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export default protectRoute
