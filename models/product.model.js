const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true 
    },
    costprice: {
        type: Number,
        required: true,
        min: 0
    },
    saleprice: {
        type: Number,
        required: true ,
        min: 0
    },
    image: {
        type: String,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    }
},{timestamps: true})


const Product = mongoose.model('Product',productSchema)

module.exports = Product 
