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
//Create Products -- /admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next)=> {
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;


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
    const data = await Product.findById(req.params.id).populate('reviews.user','name email');
    if(!data){
        return next(new ErrorHandler('Product not found', 400))
    }
    res.status(200).json({ 
        success: true,
        data
    })
})

//Update Product -- /admin/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})
// exports.updateProduct = async (req, res) => {
//     try {
//         const result = await Product.updateOne({ _id: req.params.id }, req.body);
//         // Instead of sending the whole result, send only the relevant parts
//         res.json({ success: true, message: "Product updated", data: result });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Failed to update product" });
//     }
// };

//Delete Product -- /admin/product/:id
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


//Get Reviews -- /admin/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const data = await Product.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: data.reviews
    })
})

//Delete Review - admin/review
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
        return review.rating + acc;
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

// get admin products  - /admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});

//checking
exports.updateProductStock = async (req, res) => {
    try {
        const productId = req.params.id;
        const { quantitySold } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure sufficient stock
        if (product.stock < quantitySold) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock -= quantitySold;

        await product.save();

        res.status(200).json({ message: 'Stock updated successfully', product });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Error updating stock', error });
    }
};
