/*************************************************************************************
* WEB322 - 2231 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Meenakshi Sharma
* Student ID    : 166234211
* Course/Section: WEB322 ZBB
*
**************************************************************************************/

const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
// const rentalsList = require("./models/rentals-db");
const dotenv = require("dotenv");
// const sgMail = require("@sendgrid/mail");
dotenv.config({path:"./sendgrid.env"});


// mongo connection
const mongoose = require("mongoose");

const app = express();


// Set up HandleBars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));
// Set up express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,

}));

app.use((req,res,next)=>{
  res.locals.user = req.session.user;
  next();
});





// Configure the controller.
const generalController = require("./general/generalController");

app.use("/", generalController);

const rentalsController = require("./rentals/rentals");

app.use("/rentals", rentalsController);

const loadDataController = require('./general/loadDataController');
app.use('/load-data', loadDataController);

// Make the "assets" folder public.
app.use(express.static(path.join(__dirname, "/assets")));







// setup a 'route' to listen on the default url path (http://localhost)


// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
mongoose.connect(process.env.MONGO_CONN_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the MongoDB database.");

  // Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
  // because sometimes port 80 is in use by other applications on the machine
  app.listen(HTTP_PORT, onHttpStart);
}).catch(err => {
  console.log(`Unable to connect to MongoDB ... ${err}`);
});