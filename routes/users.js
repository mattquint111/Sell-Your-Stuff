const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const { v4: uuidv4 } = require('uuid') // used to create unique id's for uploaded photos, to call -> uuidv4()
const models = require('../models') // access models directory

let uniqueFilename = '' // declare uniqueFilename variable

router.get('/add-product', (req,res) => {

    res.render('users/add-product')
})

router.post('/add-product', async (req,res) => {
    let title = req.body.title
    let description = req.body.description
    let price = parseFloat(req.body.price)
    let userId = req.session.user.userId

    let product = models.Product.build({
        title: title,
        description: description,
        price: price,
        userId: userId,
        imageURL: uniqueFilename
    })

    let persistedProduct = await product.save()
    if (persistedProduct != null) {
        res.redirect('/users/products')
    } else {
        res.render('users/add-product', {message: 'Unable to add product'})
    }
})

router.get('/products', async (req,res) => {
   let products = await models.Product.findAll({
        where: {
            userId: req.session.user.userId
        }
    })

    res.render('users/products', {products})
})

function uploadFile(req, callback) {
    new formidable.IncomingForm().parse(req) //initialize incoming form
    .on('fileBegin', (name, file) => { //fires when file begins uploading
        uniqueFilename = `${uuidv4()}.${file.name.split('.').pop()}` //uniqueFilename = <uniqueId><uploadedFileName>, cuts off extension
        file.name = uniqueFilename
        //define path of uploaded file
        file.path = __basedir + '/uploads/' + file.name //set up path -> uploads folder
    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}

router.post('/upload', (req,res) => {

    uploadFile(req, photoURL => {
        photoURL = `/uploads/${photoURL}` // update to be the entire image URL
        res.render("users/add-product", {imageURL: photoURL, className: 'product-preview-image'})
    })
}) 

// route to delete product
router.post('/delete-product', async (req,res) => {
    let productId = parseInt(req.body.productId)

   let result = await models.Product.destroy({
        where: {
            id: productId
        }
    })
    res.redirect('/users/products')
})

// route to edit product
router.get('/products/:productId', async (req,res) => {
    // id from query parameter
    let productId = req.params.productId

    // get product by unique id in Product table
    let product = await models.Product.findByPk(productId)

    res.render('users/edit', product.dataValues) // render page with product object passed in
})

router.post('/upload/edit/:productId', (req,res) => {
    uploadFile(req, async (photoURL) => {
        let productId = parseInt(req.params.productId)
        let product = await models.Product.findByPk(productId)

        let response = product.dataValues
        response.imageURL = photoURL

        res.render('users/edit', response)
    })
})

router.post('/update-product', async (req,res) => {
    const productId = req.body.productId
    const title = req.body.title
    const description = req.body.description
    const price = parseFloat(req.body.price)

    const result = await models.Product.update({
        title: title,
        description: description,
        price: price,
        imageURL: uniqueFilename
    }, {
        where: {
            id: productId
        }
    })

    res.redirect('/users/products')
}) 


module.exports = router