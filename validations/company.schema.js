const Joi = require('joi')

const companySchema = Joi.object({
    name: Joi.string().required().min(3).max(30).messages({
        'any.required': 'Company name is required',
        'string.base': 'Company name must be a string',
        'string.min': 'Company name must be at least 3 characters long',
        'string.max': 'Company name must be at most 30 characters long',
    }),
    email: Joi.string().email().required().min(6).max(50).lowercase().messages({
        'any.required': 'Email is required',
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'string.min': 'Email must be at least 6 characters long',
        'string.max': 'Email must be at most 50 characters long',
    }),
    password: Joi.string().required().min(6).max(30).messages({
        'any.required': 'Password is required',
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 30 characters long',
    }),
    phone: Joi.number().required().messages({
        'any.required': 'Phone number is required',
        'number.base': 'Phone number must be a number',
    }),
    address: Joi.string().required().messages({
        'any.required': 'Address is required',
        'string.base': 'Address must be a string',
    }),
    bankname: Joi.string().required().messages({
        'any.required': 'Bank name is required',
        'string.base': 'Bank name must be a string',
    }),
    accountno: Joi.number().required().messages({
        'any.required': 'Account number is required',
        'number.base': 'Account number must be a number',
    }),
    accountholdername: Joi.string().required().messages({
        'any.required': 'Account holder name is required',
        'string.base': 'Account holder name must be a string',
    }),
})
module.exports = companySchema
