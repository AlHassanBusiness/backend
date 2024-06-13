const mongoose = require('mongoose')

const connectDatabase = async () => {
    try {
        console.log('Database trying to connect')
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDatabase
