const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const Order = require('../models/orderModel')
const Product = require('../models/productModel');

//Create new order  -- /order/new
exports.newOrder = catchAsyncError(async (req, res, next)=> {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const data = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        data
    })
})

//Get single order -- /order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next)=> {
    const data = await Order.findById(req.params.id).populate('user', 'name email');
    if(!data) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data
    })
})

//Get logged-in user order -- /myorders

exports.myOrders = catchAsyncError(async (req, res, next)=> {
    const datas = await Order.find({user: req.user.id})
    
    if(!datas) {
        return next(new ErrorHandler(`Order not found with this id: ${req.user.id}`, 404))
    }

    res.status(200).json({
        success: true,
        count: Object.keys(datas).length,
        datas
    })
})

//Admin: Get all orders -- /orders

exports.orders = catchAsyncError(async (req, res, next)=> {
    const datas = await Order.find()
    
    if(!datas) {
        return next(new ErrorHandler('Orders not found', 404))
    }
    
    let totalAmount = 0
    datas.forEach(data => totalAmount += data.totalPrice)

    res.status(200).json({
        success: true,
        count: Object.keys(datas).length,
        totalAmount,
        datas
    })
})

//Admin: Update Order / Order Status -- /order/:id
exports.updateOrder =  catchAsyncError(async (req, res, next) => {
    const data = await Order.findById(req.params.id);

    if(data.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }
    //Updating the product stock of each order item
    data.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    data.orderStatus = req.body.orderStatus;
    data.deliveredAt = Date.now();
    await data.save();

    res.status(200).json({
        success: true
    })
    
});

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
}

//Admin: Delete Order -- /order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const data = await Order.findById(req.params.id);
    if(!data) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    await Order.deleteOne(data)   // remove() is deprecated
    res.status(200).json({
        success: true
    })
})