const express = require("express");
const app = express.Router();
const rentalModel = require("../models/rentalModel");
const rentalsList = require("../models/rentals-db");

 let newRentals =[ 
  
];

app.get("/", function (req, res) {
    res.render("rentals",{
        prov : rentalsList.getFeaturedRentals(),
        rentals : rentalsList.getRentalsByCityAndProvince()
    });
});

app.get("/list", function (req, res) {
    // res.send("Greetings Data Clerk");
    var getRentals= function() {
      let filtered = [];
    
      for (let i = 0; i < (newRentals.length) - 1; i++) {
         
              filtered.push(newRentals[i]);
          
      }
    
      return filtered;
    };
    res.render("list",{
      rentals : getRentals()
    });
});

app.get("/add",function(req,res){
    res.render("add");
});

app.get("/remove/:id",function(req,res){
  res.render("remove", { id: req.params.id });
});

app.post('/remove/:id', (req, res) => {
  const rentalIndex = newRentals.findIndex(rental => rental.id === req.params.id);
  if (rentalIndex < 0) {
    return res.status(404).send('Rental not found');
  }
  const rental = newRentals[rentalIndex];
  // Delete the image file from the web server
  fs.unlinkSync(rental.imagePath);
  // Remove the rental from the array
  newRentals.splice(rentalIndex, 1);
  res.redirect('/list');
});

app.post("/add",function(req,res){
 
       let headline= req.body.headline;
       let numSleeps=req.body.numSleeps;
       let numBedrooms= req.body.numBedrooms;
       let numBathrooms= req.body.numBathrooms;
       let pricePerNight= req.body.pricePerNight;
       let city= req.body.city;
       let province= req.body.province;
       let  imageUrl= req.body.imageUrl;
       let featuredRental= req.body.featuredRental === 'on';
   
       const rental = new rentalModel({headline, numSleeps,numBedrooms,numBathrooms,
        pricePerNight,city,province,imageUrl,featuredRental});
        rental.save()
        .then(userSaved=>{
          console.log(`Rental ${userSaved.headline} has been added to the database..`);
          console.log(userSaved);
          newRentals.push(userSaved.toObject());
        var updateRentals= function() {
          let filtered = [];
          for (let i = 0; i < (newRentals.length) ; i++) {
              filtered.push(newRentals[i]);
            }
          return filtered;
        };
        res.render("list",{
          rentals : updateRentals()
        });
      })
      .catch(err=>{
        console.log(`Error adding user to the database.... ${err}`);
      });

      
});


app.get("/edit/:id", function (req, res) {
  rentalModel.findById(req.params.id, function (err, foundRental) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { rental: foundRental });
    }
  });
});

app.put("/edit/:id", function (req, res) {
  rentalModel.findByIdAndUpdate(
    req.params.id,
    req.body.rental,
    function (err, updatedRental) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/list");
      }
    }
  );
});



app.get("/remove/:id", function (req, res) {
  rentalModel.findById(req.params.id, function (err, foundRental) {
    if (err) {
      console.log(err);
    } else {
      res.render("remove", { rental: foundRental });
    }
  });
});

app.delete("/remove/:id", function (req, res) {
  rentalModel.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/list");
    }
  });
});



module.exports = app;