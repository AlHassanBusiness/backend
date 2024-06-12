const mongoose = require('mongoose')

const investmentSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0, 'Amount must be positive'],
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
            index: true,
        },
    },
    { timestamps: true },
)

const Investment = mongoose.model('Investment', investmentSchema)

module.exports = Investment
