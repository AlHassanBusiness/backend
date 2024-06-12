const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        bankname: {
            type: String,
            required: true,
        },
        accountno: {
            type: Number,
            required: true,
        },
        accountholdername: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

const Client = mongoose.model('Client', companySchema)

module.exports = Client
