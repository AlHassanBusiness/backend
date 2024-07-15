const mongoose = require('mongoose')

const decidedprofitSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    total_earning: {
        type: Number,
        required: true 
    },
    to_client: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const DecidedProfit = mongoose.model('DecidedProfit',decidedprofitSchema)

module.exports = DecidedProfit