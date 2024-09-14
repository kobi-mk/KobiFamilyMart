const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts, updateProductStock } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, isAuthorizeRoles} = require('../middlewares/authenticate')
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/review').put(isAuthenticatedUser, createReview)

//checking
router.put('/product/:id/stock', updateProductStock);

//Admin routes                            
router.route('/admin/product/new').post(isAuthenticatedUser, isAuthorizeRoles('admin'), upload.array('images'), newProduct)
router.route('/admin/products').get(isAuthenticatedUser, isAuthorizeRoles('admin'), getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticatedUser, isAuthorizeRoles('admin'), deleteProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser, isAuthorizeRoles('admin'), upload.array('images'), updateProduct)
router.route('/admin/reviews').get(isAuthenticatedUser, isAuthorizeRoles('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticatedUser, isAuthorizeRoles('admin'),deleteReview)

module.exports = router