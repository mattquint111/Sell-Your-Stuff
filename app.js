const express = require('express') // express
const app = express()
const mustacheExpress = require('mustache-express') //mustache
const bodyParser = require('body-parser') //body-parser -> urlencoded
const path = require('path') // for partials path
const models = require('./models') // sequelize models
const bcrypt = require('bcrypt') // encryption
const user = require('./models/user') // user table in daatabase (sequelize)
const session = require('express-session') // sessions
const indexRoutes = require('./routes/index') // index routes
const userRoutes = require('./routes/users')

// local host port
const PORT = 3000
// path for directory ./views
const VIEWS_PATH = path.join(__dirname, '/views')
//salt rounds
SALT_ROUNDS = 10

global.__basedir = __dirname // global variable for root directory path name

// middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
    secret: 'somesecret', // secret key
    resave: true,
    saveUninitialized: false //won't save session if nothing in session
}))
app.use('/', indexRoutes) // any route at root handled in ./routes/index
app.use('/users', userRoutes) // any route at /users/...

// static folders
app.use('/uploads', express.static('uploads')) // uploads static folder at localhost:3000/uploads
app.use('/css', express.static('css')) // static folder for css at localhost:3000/css/style.css


// set up template engine
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

// routes
//-------
// moved to routes/index.js
// app.get('/register', (req,res) => {
//     res.render('register')
// })

// moved to routes/index.js
// app.post('/register', async (req,res) => {
//     // get input data from page
//     let username = req.body.username
//     let password = req.body.password

//     // check table: Users for username
//     let persistedUser = await models.User.findOne({
//         where: {
//             username: username
//         }
//     })
//     // if that username doesn't exist -> create new user object and save to table
//     if (persistedUser == null) {
//         bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
//             if(error) {
//                 res.render('/register', {message: 'Error creating user'})
//             } else {
//                 // create user (with hashed password)
//                 let user = models.User.build({
//                     username: username,
//                     password: hash
//                 })
                
//                 // save user to table
//                 let savedUser = await user.save()
//                 // after user is created send to log in page
//                 if(savedUser != null) {
//                  res.redirect('/login')
//                 } else { // savedUser == null -> send user to registration page
//                     res.render('/register', {message: "User already exists!"})
//                 }
//             }
//         })
//     } else { // user already exists in table -> send user to registration page
//         res.render('register', {message: "User already exists!"})
//     }
// })

// moved to routes/index.js
// app.get('/login', (req,res) => {
//     res.render('login')
// })

// moved to routes/index.js
// app.post('/login', async (req,res) => {
//     let username = req.body.username
//     let password = req.body.password

//   // find user in table users by username
//     let user = await models.User.findOne({
//         where: {
//             username: username
//         }
//     })
//     // check if user exists
//     if (user != null) {
//         // check input password against hashed password in table
//         bcrypt.compare(password, user.password, (error, result) => {
//             if (result) {
//                 //create a session and redirect user
//                 if (req.session) {
//                     //set session user to the userId
//                     req.session.user = {userId: user.id}
//                     res.redirect('/users/products')
//                 } 
//             } else {
//                 res.render('login', {message: 'Incorrect username or password'})
//             }
//         })
//     } else { // if user is null
//         res.render('login', {message: 'Incorrect username or password'})
//     } 

// })


// start server
app.listen(PORT, () => console.log("Server is running..."))