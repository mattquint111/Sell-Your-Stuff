const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const { v4: uuidv4 } = require('uuid') // used to create unique id's for uploaded photos, to call -> uuidv4()

let uniqueFilename = '' // declare uniqueFilename variable

router.get('/add-product', (req,res) => {

    res.render('users/add-product')
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

module.exports = router