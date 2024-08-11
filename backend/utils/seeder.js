const data = require('../data/products.json')
const Product = require('../models/productModel')
const dotenv = require('dotenv')
const connectDatabse = require('../config/database')
const path = require('path')

dotenv.config({path:path.join(__dirname, "..", "config", "config.env")})
connectDatabse()

const seedProducts = async ()=>{
    try{
    await Product.deleteMany()
    console.log('Product deleted ');
    await Product.insertMany(data)
    console.log('All products added!');
    }catch(err){
        console.log(err.message);
        
    }
    process.exit();
    
}
seedProducts();