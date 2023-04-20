const express = require("express");
const userModel = require("../models/userModel");
const app = express.Router();
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
const bcryptjs = require('bcryptjs');

let userInfo={};
app.get("/", function (req, res) {
    res.render("home");
});
app.get("/sign-up", function (req, res) {
    res.render("sign-up");
});

app.get("/log-in", function (req, res) {
    res.render("log-in");
});

app.get("/welcome", function (req, res) {
  res.render("welcome", userInfo);
});


app.post("/sign-up", function (req, res) {

    
    let message = {};
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;
    let checkSpaces = /^\s+$/;
    let emailValid = /^[0-9a-zA-Z_]+@[a-zA-Z_]+\.[a-zA-Z]+$/;
    let passValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/    ;
    if ( fname == "" ||checkSpaces.test(fname)|| fname == null ) {
      message.fnameMsg = "Please enter a valid first name";
    }
    if (lname == "" || lname == null || checkSpaces.test(lname) ) {
      message.lnameMsg = "Please enter a valid last name";
    }
    if (
      email == "" ||
      email == null ||
      checkSpaces.test(email || !emailValid.test(email))
    ) {
      message.emailMsg = "Please enter a valid email address";
    }
    if (
      password == "" || password == null || checkSpaces.test(password) 
     || !passValid.test(password)
    )
     {
      message.passwordMsg =
        "Please enter a valid password with atleast 8 and maximum 12 characters, atleast one uppercase, one lowercase, one number and one special character";
    }
    if (
      message.fnameMsg || message.lnameMsg || message.emailMsg ||message.passwordMsg) {
      message.fname = fname;
      message.lname = lname;
      message.email = email;
      message.password = password;
      res.render("sign-up", message);
    } else {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "smeenakshi1008@outlook.com",
        subject: "Welcome to VacaySpot",
        text: `Hi Welcome to VacaySpot ${fname} ${lname}, We are glad to have you with us. 
        I am Meenakshi Sharma and the name of my website is VacaySpot`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Successfully email sent!!!");
        })
        .catch((error) => {
          console.error(error);
        });
  
      userInfo.email = email;
      res.redirect("/welcome");
  
  
  
    }

    const newUser = new userModel({fname, lname, email, password});
    newUser.save()
      .then(userSaved=>{
        console.log(`User ${userSaved.fname} has been added to the database..`);
      })
      .catch(err=>{
        console.log(`Error adding user to the database.... ${err}`);
      });
    
  
  });
  
  app.post("/log-in", function (req, res) {

    
      let message = {};
      let email = req.body.email;
      let password = req.body.password;
      let checkSpaces = /^\s+$/;
      const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
      if (email == "" || email == null || checkSpaces.test(email)) {
        message.emailMsg = "Please enter a valid email address";
      }
      if (password == "" || password == null || checkSpaces.test(password)) {
        message.passwordMsg = "Please enter your password";
      }
      if(!emailCheck.test(email)){
        message.emailMsg = "Please enter a valid email address";
      }
       if(!passwordCheck.test(password)){
        message.passwordMsg = "Password must be between 8 to 12 characters and contain at least one lowercase letter, uppercase letter, number and a symbol.";
      }
      if (message.emailMsg || message.passwordMsg) {
        message.email = email;
        message.password = password;
        res.render("log-in", message);
      }
      

      let errors =[];
      userModel.findOne({
        email:req.body.email
      })
      .then(user => {
        if(user){
          bcryptjs.compare(req.body.password,user.password)
          .then(isMatched =>{
            if(isMatched){
              req.session.user = user;
              req.session.isCustomer =req.body.role === "customer";
              
              if(req.session.isCustomer){
                // res.redirect("/carts");
                res.redirect("/carts");

              }
              else{
                res.redirect("/rentals/list");
              }

            }
            else{
              console.log("Passwords do not match")
              errors.push("Sorry, your password does not match our database");
              res.render("log-in",{errors}

              );
            }
          })
        }
        else{
          console.log("User not found in the database");
          errors.push("Email was not found in the database");
          res.render("log-in",{errors}
          );
        }
      })
      .catch(err=>{
        console.log(`Error finding the user in the database... ${err}`);
        errors.push("Opps, something went wrong");

        res.render("log-in",{errors}
              );
      })
      // }

    });


 
  app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/log-in");
  })








  // Set up a faux song database.
const songs = [
 

    {
      id:1,
  headline: "Cozy Lakefront Log Cabin",
  numSleeps: 2,
  numBedrooms: 1,
  numBathrooms: 1,
  pricePerNight: 125.99,
  city: "Scugog",
  province: "Ontario",
  imageUrl: "/images/rental1.jpg",
  featuredRental: true
},
{
  id:2,
  headline: "Downtown Toronto Apartment",
  numSleeps: 4,
  numBedrooms: 2,
  numBathrooms: 1,
  pricePerNight: 175.99,
  city: "Toronto",
  province: "Ontario",
  imageUrl: "/images/rental2.jpg",
  featuredRental: false
},
{
  id:3,
  headline: "Lakefront Cottage",
  numSleeps: 6,
  numBedrooms: 3,
  numBathrooms: 2,
  pricePerNight: 249.99,
  city: "Scugog",
  province: "Ontario",
  imageUrl: "/images/rental3.jpg",
  featuredRental: false
},
{
  id:4,
  headline: "Luxury Condo with a View",
  numSleeps: 2,
  numBedrooms: 1,
  numBathrooms: 1,
  pricePerNight: 199.99,
  city: "Toronto",
  province: "Ontario",
  imageUrl: "/images/rental4.jpg",
  featuredRental: false
},
{
  id:4,
  headline: "Rustic Cabin Retreat",
  numSleeps: 4,
  numBedrooms: 1,
  numBathrooms: 1,
  pricePerNight: 99.99,
  city: "Scugog",
  province: "Ontario",
  imageUrl: "/images/rental5.jpg",
  featuredRental: true
},
{
  id:5,
  headline: "Spacious Condo in the Heart of Toronto",
  numSleeps: 6,
  numBedrooms: 2,
  numBathrooms: 2,
  pricePerNight: 299.99,
  city: "Toronto",
  province: "Ontario",
  imageUrl: "/images/rental6.jpg",
  featuredRental: true
},
{
  id:6,
  headline: "Four Seasons Hotel Toronto",
  numSleeps: 4,
  numBedrooms: 2,
  numBathrooms: 2,
  pricePerNight: 347.99,
  city: "Toronto",
  province: "Ontario",
  imageUrl: "/images/rental6.jpg",
  featuredRental: false
}
];

// Find a song from the faux database.
const findSong = function (id) {
  return songs.find(song => {
      return song.id == id;
  });
}

// Define a function to prepare the view model.
const VIEW_NAME = "carts";

const prepareViewModel = function (req, message) {
  if (req.session && req.session.user) {
      // The user is signed in and has a session established.

      let cart = req.session.cart || [];

      // Used to store how much is owed.
      let cartTotal = 0;

      // Check if the cart has any songs.
      const hasSongs = cart.length > 0;

      // If there are songs in the cart, then calculate the order total.
      if (hasSongs) {
          cart.forEach(cartSong => {
              cartTotal += cartSong.song.pricePerNight * cartSong.numSleeps;
          });
      }

      return {
          message,
          hasSongs,
          songs: cart,
          cartTotal: "$" + cartTotal.toFixed(2)
      };
  }
  else {
      // The user is not signed in, return default information.
      return {
          message,
          hasSongs: false,
          songs: [],
          cartTotal: "$0.00"
      };
  }
};

// Add your routes here
// e.g. app.get() { ... }
app.get("/carts", (req, res) => {
  res.render(VIEW_NAME, prepareViewModel(req));
});

// Route to add a new song to the shopping cart.
// The ID of the song will be specified as part of the URL.
app.get("/add-rental/:id", (req, res) => {
  let message;
  const songId = parseInt(req.params.id);

  // Check if the user is signed in.
  if (req.session.user) {
      // The user is signed in.

      // A shopping cart object will look like this:
      //      id: ID of the song
      //      qty: Number of puchases for this song.
      //      song: The details about the song (for displaying in the cart).

      let song = findSong(songId);
      let cart = req.session.cart = req.session.cart || [];

      if (song) {
          // Song found in the database.

          // Search the shopping cart to see if the song is already added.
          let found = false;

          cart.forEach(cartSong => {
              if (cartSong.id == songId) {
                  // Song is already in the shopping cart.
                  found = true;
                  cartSong.qty++;
              }
          });

          if (found) {
              message = "The song was already in the cart, incremented quantity by one.";
          }
          else {
              // Song was not found in the shopping cart.
              // Create a new object and add to the cart.
              cart.push({
                  id: songId,
                  qty: 1,
                  song
              });

              // Logic to sort the cart. Sort by the artist name.
              cart.sort((a, b) => a.song.artist.localeCompare(b.song.artist));

              message = "The rental was added to the shopping cart."
          }
      }
      else {
          // Song was not found in the database.
          message = "The rental was not found in the database.";
      }
  }
  else {
      // The user is not signed in.
      message = "You must be logged in.";
  }

  res.render(VIEW_NAME, prepareViewModel(req, message));
});

// Route to remove a song from the shopping cart.
// The ID of the sog will be specified as part of the URL.
app.get("/remove-rental/:id", (req, res) => {
  let message;
  const songId = parseInt(req.params.id);

  // Check if the user is signed in.
  if (req.session.user) {
      // The user is signed in.

      let cart = req.session.cart = req.session.cart || [];

      // Find the index of the song in the shopping cart.
      const index = cart.findIndex(cartSong => cartSong.id == songId);

      if (index >= 0) {
          // Song was found in the cart.
          message = `Removed "${cart[index].song.name}" from the cart.`;
          cart.splice(index, 1);
      }
      else {
          // Song was not found in the cart.
          message = "Song was not found in the cart.";
      }
  }
  else {
      // The user is not signed in.
      message = "You must be logged in.";
  }

  res.render(VIEW_NAME, prepareViewModel(req, message));
})

// Route to login the user.

module.exports = app;