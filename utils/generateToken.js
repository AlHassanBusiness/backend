const jwt = require('jsonwebtoken')

const jwtOptions = {
    expiresIn: '1d',
}

const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
}

const generateAdminTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, jwtOptions)
    res.cookie('admin_jwt', token, cookieOptions)
}

const generateClientTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, jwtOptions)
    res.cookie('client_jwt', token, cookieOptions)
}

module.exports = {
    generateAdminTokenAndSetCookie,
    generateClientTokenAndSetCookie,
}
