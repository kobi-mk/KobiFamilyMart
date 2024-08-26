const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')

//Get Products -- /products
exports.getProducts = catchAsyncError(async (req, res, next) =>{
    const resultsPerPage = 3
    
    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    const data = await buildQuery().paginate(resultsPerPage).query;

    //await new Promise(resolve => setTimeout(resolve,3000))
    //return next(new ErrorHandler('Unable to send products!', 400))
    
    res.status(200).json({
        success: true,
        count: productsCount,
        resultsPerPage,
        data
    })
})
//Create Products -- /product/new
exports.newProduct = catchAsyncError(async (req, res, next)=> {
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        message: "Sussfully inserted",
        product
    })
})

//Get Single Product  -- /product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) =>{
    const data = await Product.findById(req.params.id);
    if(!data){
        return next(new ErrorHandler('Product not found', 400))
    }
    res.status(200).json({ 
        success: true,
        data
    })
})

//Update Product -- /product/:id
exports.updateProduct = async (req, res, next)=> {
    let data = await Product.findById(req.params.id);
    if(!data){
        res.status(404).json({
            success:false,
            message: "Product not found"
        });
    }
    data = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data
    })
}
// exports.updateProduct = async (req, res) => {
//     try {
//         const result = await Product.updateOne({ _id: req.params.id }, req.body);
//         // Instead of sending the whole result, send only the relevant parts
//         res.json({ success: true, message: "Product updated", data: result });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Failed to update product" });
//     }
// };

//Delete Product -- /product/:id
exports.deleteProduct = async (req, res) => {
    let data = await Product.findById(req.params.id)

    if(!data){
        res.status(404).json({
            success:false,
            message: "Product not found"
        });
    }

    await Product.deleteOne(data)   //remove() is deprecated
    
    res.status(200).json({
        success: true,
        message: "Product deleted!"
    }) 
}

// Create Review -- /review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating: Number(rating), // Convert rating to a number
        comment
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Check if the user has already reviewed the product
    const isReviewed = product.reviews.find(review  => review.user.toString() === req.user.id.toString());review

    if (isReviewed) {
        // Update the existing review
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = Number(rating); // Ensure this is a number
            }
        });
    } else {
        // Add the new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate the new average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + Number(review.rating), 0); // Convert to number during reduce
    const averageRating = totalRating / product.reviews.length;

    product.ratings = isNaN(averageRating) ? 0 : averageRating;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});


//Get Reviews -- /reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const data = await Product.findById(req.query.id)//.populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: data.reviews
    })
})

//Delete Review -- /review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.productId);
    
    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
       return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return Number(review.rating) + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })


});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});