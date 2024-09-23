const express = require('express');
const router = express.Router();

const ownerModel = require('../models/owner.model')

router.get('/', (req, res) => {
    res.send("owner hacker  ")
})

router.post('/create', async (req, res) => {
    let owners = await ownerModel.find()
    if (owners.length > 0) {
        res.status(504)
            .send("You don't have permission to create a new owner..!! admin is set")
    }

    else{
    const { fullname, email, password } = req.body
    const createdOwner = await ownerModel.create({
        fullname,
        email,
        password
    })
    res.status(201)
        .json({ owner: createdOwner, message: "owner created succesfully" })
    }
    
})

router.get('/admin', (req, res) => {
    const success=req.flash('success')
    const error=req.flash('error')
    res.render("createproducts",{success,error})
})






module.exports = router;
