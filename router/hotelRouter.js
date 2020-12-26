const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");


router.route('/')
.get((req , res, next ) => {
    Hotel.find()
    .then ((hotels) => {
        res.json(hotels);
    }).catch(next);
})

  .post((req, res, next) => {
let {hotelName, description, contact, email, description}=req.body;
Hotel.findOne({ owner: req.user.id })
.then((hotel) => {
  if (hotel) {
    let err = new Error("Hotel already created!");
    err.status = 401;
    return next(err);
  }
    Hotel.create({hotelName, contact,, email, description, owner : req.user.id})
    .then((hotel) => {

        res.status(201).json(hotel);
      })
      .catch(next);
    })
    .catch(next);
  })

  .delete((req, res, next) => {
    Hotel.deleteOne({owner: req.user.id})
    .then ((reply) => {
            res.json(reply);
        })
        .catch(next);
   
  });

router.route('/:hotelID')
.get((req, res, next) =>{
    Hotel.findById(req.params.hotelID)
    .then((hotel) => {
        if (hotel !== null){
        res.json(hotel);}
        else {
            let err = new Error("File not found!");
            err.status = 404;
            next(err);
          }

    }).catch(next);
})

.put((req, res, next) => {
    Hotel.findByIdAndUpdate(req.params.hotelID, {$set : req.body}, {new : true })
    .then((updatedHotel) => {
        res.json(updatedHotel);
      })
      .catch(next);
  })

  
router
.route("/:hotelID/address")
.get((req, res, next) => {
  Hotel
    .findById(req.params.hotelID)
    .then((hotel) => {
      res.json(hotel.address);
    })
    .catch(next);
})

.post((req, res, next) => {
  let {country,state, street} = req.body;
  Hotel.findById(req.params.hotelID).then((hotel) => {
    hotel.address.push({country, state, street});
    hotel
      .save()
      .then((updatedHotel) => {
        res.status(201).json(updatedHotel);
      })
      .catch(next);
  });
})

.delete((req, res, next) => {
  profile
    .findById(req.params.profileID)
    .then((profile) => {
      profile.address = [];
      profile
        .save()
        .then((updatedProfile) => {
          res.json(updatedProfile.address);
        })
        .catch(next);
    })
    .catch(next);
});



module.exports = router;
