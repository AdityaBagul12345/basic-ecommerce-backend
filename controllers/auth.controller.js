const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {
    try {
        const resgiterSchema = joi.object({
            fullname: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().min(6).required()
        })
        
        const { error, value } = resgiterSchema.validate(req.body);

        if (error) {
            return res.status(400).render('', { error: error.details.map(detail => detail.message) });
        }
        const { fullname, email, password } = value;
        const user = await userModel.findOne({ email })

        if (user) {
            return res.status(400).send("User already exists")
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await userModel.create({
                fullname,
                email,
                password: hashedPassword
            })
            const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET_KEY)
            res.cookie("token", token)
            res.status(200).redirect('/')
        }
    } catch (error) {
        console.log(error)
    }
}

async function loginUser(req,res) {
    try {
        const loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required()
        })
    
        const { error, value } = loginSchema.validate(req.body)
        if (error) {
            req.flash('error', error.details.map(detail => detail.message));
            return res.redirect('/');
        }
    
        const { email, password } = value;
        const user = await userModel.findOne({ email })
        if (!user) {
            req.flash('error', 'Invalid Credentials');
            return res.redirect('/');
        }
        const passMatch = await bcrypt.compare(password, user.password)
        if (!passMatch) {
            req.flash('error', 'Email or Password is wrong');
            return res.redirect('/');
        }
        const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET_KEY)
        res.cookie("token", token)
        res.redirect("/shop")
    } catch (error) {
        console.log(error)
    }
}
async function logout(req,res){
    res.cookie("token","")
    res.redirect('/')
}

module.exports = { registerUser, loginUser,logout }