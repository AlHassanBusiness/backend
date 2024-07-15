const mongoose = require('mongoose')

const salesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true 
    },
    customer: {
        type: String,
        required: true 
    },
},
{ timestamps: true }
)

const Sales = mongoose.model('Sales',salesSchema)

module.exports = Sales 