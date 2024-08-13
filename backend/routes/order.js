const express = require('express')
const router = express.Router()
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController')
const {isAuthenticatedUser, isAuthorizeRoles} = require('../middlewares/authenticate')

router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/myorders').get(isAuthenticatedUser, myOrders)

//Admin routes
router.route('/orders').get(isAuthenticatedUser, isAuthorizeRoles('admin'), orders)
router.route('/order/:id').put(isAuthenticatedUser, isAuthorizeRoles('admin'), updateOrder)
router.route('/order/:id').delete(isAuthenticatedUser, isAuthorizeRoles('admin'), deleteOrder)


module.exports = router 