const Product = require('../models/product.model')
const upload = require('../utils/upload')



const getProducts = async(req,res) => {
    try {
        const products = await Product.find().lean()
        return res.status(200).json({data: products})
    } catch (error) {
        console.error("Error in fetching all products",error.message)
        return res.status(500).json({error: error.message})
    }
}

const createProduct = async(req,res) => {
    try {
        upload(req,res,(error) => {
            if(error){
                return res.status(400).json({error: error.message})
            }


            const {name,description,costprice,saleprice,store} = req.body

            const imageUrl = req.file ? `uploads/${req.file.filename}` : ''
            if(!imageUrl){
                return res.status(400).json({
                    error: 'Error uploading image'
                })
            }

            let product = new Product({
                name,
                description,
                costprice,
                saleprice,
                image: imageUrl,
                store 
            })

            product.save()
                .then(product => res.json(product))
                .catch(err => res.status(500).json({ msg: 'Server Error', error: err }));
            });
    } catch (error) {
        console.log("Error creating product",error.message)
        return res.status(505,json({error: 'Error creating product'}))
    }
}


const getAllProductsOfStore = async(req,res) => {
    try {
        const {id} = req.params
        
        const products = await Product.find({
            store: id
        }).lean().populate('store')

        return res.status(200).json({
            data: products
        })

    } catch (error) {
        console.log("Error fetching all products",error.message)
        return res.status(500).json({error: 'Error fetching products'})
    }
}

const deleteProduct = async(req,res) => {
    try {
        const {id} = req.params 

        await Product.findOneAndDelete(id).then(() => {
            return res.status(200).json({message: "Product Deleted Successfully"})
        }).catch((error) => {
            console.log("Error deleting Product, i think product not found",error.message)
            return res.status(500).json({error: 'Error deleting product'})
        })

    } catch (error) {
        
    }
}



module.exports = {createProduct,getAllProductsOfStore,deleteProduct,getProducts}