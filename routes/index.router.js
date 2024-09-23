const express = require('express');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();
const productModel = require('../models/product.model')
const userModel = require('../models/user.model')

router.get('/', (req, res) => {
    let error = req.flash('error')
    res.render('index',{error});
});

router.get('/shop', isLoggedIn, async (req, res) => {
    const sortBy = req.query.sortBy || 'name';  // Default sorting by name
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;  // Default ascending order

    let products = await productModel.find().sort({ [sortBy]: sortOrder });

    res.render('shop', { products, sortBy, sortOrder });
});


// Add to Cart Route
router.post('/add-to-cart/:productId', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id; // Assuming `req.user` contains the logged-in user details
        
        // Find the user and update the cart with the product ID
        await userModel.findByIdAndUpdate(userId, {
            $push: { cart: productId }  // Add only the product ID
        });

        req.flash('success', 'Product added to cart!');
        res.redirect('/shop');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to add product to cart.');
        res.redirect('/shop');
    }
});


router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming `req.user` contains the logged-in user details
        
        // Find the user and populate the cart
        const user = await userModel.findById(userId).populate('cart');

        // Ensure cartItems is always an array
        const cartItems = user.cart || [];

        res.render('cart', { cartItems });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to load cart.');
        res.redirect('/shop');
    }
});

router.post('/remove-from-cart/:productId', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id;

        // Remove the product from the cart
        await userModel.findByIdAndUpdate(userId, {
            $pull: { cart: productId }
        });
        
        req.flash('success', 'Product removed from cart!');
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to remove product from cart.');
        res.redirect('/cart');
    }
});

module.exports = router;
