const mongoose = require('mongoose')

const profitSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
)

const Profit = mongoose.model('Profit', profitSchema)

module.exports = Profit
