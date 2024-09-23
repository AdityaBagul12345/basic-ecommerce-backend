const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config')
const productModel = require('../models/product.model')

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { image, name, price, discount, bgcolor, panelcolor, textcolor } = req.body

        if (!req.file || !name || !price || !discount || !bgcolor || !panelcolor || !textcolor) {
            req.flash('error', 'All fields are required!');
            return res.redirect('/owners/admin'); // Redirect back to the form
        }
        
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price, discount, bgcolor, panelcolor, textcolor
        })
        req.flash("success","Product created successfully")
        res.redirect('/owners/admin')
    } catch (error) {
        console.log(error,"at Product router")
    }
})

module.exports = router;
