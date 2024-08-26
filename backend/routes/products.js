const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, isAuthorizeRoles} = require('../middlewares/authenticate')

router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
                       .delete(isAuthenticatedUser, deleteReview)
router.route('/reviews').get(getReviews)

//Admin routes                            
router.route('/admin/product/new').post(isAuthenticatedUser, isAuthorizeRoles('admin'), newProduct)

module.exports = router