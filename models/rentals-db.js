const rentalModel = require("../models/rentalModel");

var rentals = [
    {
    
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
  const savedListings = [];

  for (let i = 0; i < rentals.length; i++) {
    const rental = new rentalModel(rentals[i]);
    rental
      .save()
      .then((savedRental) => {
        console.log(`Rental ${savedRental.headline} has been added to the database.`);
        savedListings.push(savedRental.toObject());
      })
      .catch((err) => {
        console.log(`Error adding rental to the database: ${err}`);
      });
  }
  
  module.exports.getFeaturedRentals = function () {
    let filtered = [];
  
    for (let i = 0; i < savedListings.length; i++) {
      if (savedListings[i].featuredRental) {
        filtered.push(savedListings[i]);
      }
  
    }
    }  

// module.exports.getRentalsByCityAndProvince = function() {



//   let rentalsByCity = [];
//   for (let rental of rentals) {
//     let cityProvince = rental.city + ", " + rental.province;
//     if (!rentalsByCity[cityProvince]) {
//       rentalsByCity[cityProvince] = { cityProvince: cityProvince, rentals: [] };
//     }
//     rentalsByCity[cityProvince].rentals.push(rental);
//   }
//   return Object.values(rentalsByCity);

// }   

module.exports.getRentalsByCityAndProvince = function() {
  


  let rentalsByCity = [];
  for (let rental of savedListings) {
    let cityProvince = rental.city + ", " + rental.province;
    if (!rentalsByCity[cityProvince]) {
      rentalsByCity[cityProvince] = { cityProvince: cityProvince, rentals: [] };
    }
    rentalsByCity[cityProvince].rentals.push(rental);
  }
  return Object.values(rentalsByCity);


}   

  

  
  