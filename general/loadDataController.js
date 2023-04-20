const express = require("express");
const rentalModel = require("../models/rentalModel");
const app = express.Router();

// Define a global variable to store the state of the database

app.get('/rentals/list', (req, res) => {
  if (rentalModel.count()>0) {
    // TODO: Add logic to load data to the database
  
    res.render('rentals', { message: 'Rentals have already been added to the database' });
  } else {

    for (let i = 0; i < rentals.length; i++) {
      const rental = new rentalModel(rentals[i]);
      rental.save()
        .then(savedRental => {
          console.log(`Rental ${savedRental.headline} has been added to the database.`);
          res.render('rentals', { message: 'Added rentals to the database' });
        })
        .catch(err => {
          console.log(`Error adding rental to the database: ${err}`);
        });
    }
  
    
  }
});


module.exports = app;