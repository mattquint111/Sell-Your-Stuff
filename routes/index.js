// handles all routes at localhost:3000/
const express = require('express')
const router = express.Router() //express-router
const bcrypt = require('bcrypt') //encryption
const models = require('../models') //sequelize models //go up 2-routes to find folder
const { Router } = require('express')
const SALT_ROUNDS = 10 // bcrypt

router.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId
    const product = await models.Product.findByPk(productId)

    res.render('product-details', product.dataValues)
})

router.get('/', async (req,res) => {
    let products = await models.Product.findAll()
    res.render('index', {products: products})
})

router.get('/register', (req,res) => {
    res.render('register')
})

router.post('/register', async (req,res) => {
        // get input data from page
        let username = req.body.username
        let password = req.body.password
    
        // check table: Users for username
        let persistedUser = await models.User.findOne({
            where: {
                username: username
            }
        })
        // if that username doesn't exist -> create new user object and save to table
        if (persistedUser == null) {
            bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
                if(error) {
                    res.render('/register', {message: 'Error creating user'})
                } else {
                    // create user (with hashed password)
                    let user = models.User.build({
                        username: username,
                        password: hash
                    })
                    
                    // save user to table
                    let savedUser = await user.save()
                    // after user is created send to log in page
                    if(savedUser != null) {
                     res.redirect('/login')
                    } else { // savedUser == null -> send user to registration page
                        res.render('/register', {message: "User already exists!"})
                    }
                }
            })
        } else { // user already exists in table -> send user to registration page
            res.render('register', {message: "User already exists!"})
        }
    })

router.get('/login', (req,res) => {
    res.render('login')
})

router.post('/login', async (req,res) => {
    let username = req.body.username
    let password = req.body.password

    // find user in table users by username
    let user = await models.User.findOne({
        where: {
            username: username
        }
    })
    // check if user exists
    if (user != null) {
        // check input password against hashed password in table
        bcrypt.compare(password, user.password, (error, result) => {
            if (result) {
                //create a session and redirect user
                if (req.session) {
                    //set session user to the userId
                    req.session.user = {userId: user.id}
                    res.redirect('/users/products')
                } 
            } else {
                res.render('login', {message: 'Incorrect username or password'})
            }
        })
    } else { // if user is null
        res.render('login', {message: 'Incorrect username or password'})
    } 

})

// export to app.js
module.exports = router
