const express = require("express");
const router = express.Router();
const Guest = require('../models/Guest');
const auth = require('./Authorization');
const validation = require("../validator/validator");
const Hotel = require("../models/Hotel");
const Reservation = require('../models/Reservation');
const Room = require("../models/Room");



router
  .route("/")
  .get((req, res, next) => {
    if (req.user.role === "guest") {
        Guest
        .findOne({ owner: req.user.id })
        .then((guest) => {
          res.json(guest);
        })
        .catch(next);
      } else
      Guest
      .find()
      .then((guest) => {
        res.json(guest);
      })
      .catch(next);
  })

  .post(auth.verifyGuest, (req, res, next) => {
    let { firstName, lastName, citizen_id, image, gender, contact, email, guestImage
         ,balance,address:country,address:state,address:street } = req.body;
    
   
    Guest.findOne({ owner: req.user.id })
      .then((guest) => {
        if (guest) {
          let err = new Error("Guest profile already created!");
          err.status = 401;
          return next(err);
        }

        Guest
          .create({
            address:country, address:state, address:street,
            firstName,
            lastName,
            image,
            gender,
            contact,
            email,
            citizen_id,
            balance,
            owner: req.user.id,
          })
          .then((profile) => {
            res.status(201).json(profile);
          })
          .catch(next);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    Guest
      .deleteOne({ owner: req.user.id })
      .then((reply) => {
        res.json(reply);
      })
      .catch(next);
  });

router
  .route("/:guestID")
  .get((req, res, next) => {
    Guest
      .findById(req.params.guestID)
      .then((guest) => {
        res.json(guest);
      })
      .catch(next);
  })

  .put((req, res, next) => {
    Guest
      .findByIdAndUpdate(
        req.params.guestID,
        { $set: req.body },
        { new: true }
      )
      .then((updatedGuest) => {
        res.json(updatedGuest);
      })
      .catch(next);
  })
  
  router.route("/:guestID/hotels")
  .get((req, res, next) => {
  Hotel.find()
  .populate("rooms")
    .then((hotels) => {
      res.json(hotels);
    })
    .catch(next);
})

router.route("/:guestID/hotels/:hotelID")
  .get((req, res, next) => {
  Hotel.findById(req.params.hotelID)
  .populate("rooms")
    .then((hotel) => {
      res.json(hotel);
    })
    .catch(next);
})

router
  .route("/:guestID/hotels/:hotelID/rooms")
  .get((req, res, next) =>{
      Hotel.findById(req.params.hotelID)
      .populate('rooms')
      .then((hotel) =>{
          res.json(hotel.rooms);
      }).catch(next);
  })

  router
  .route("/:guestID/hotels/:hotelID/rooms/:roomID")
  .get((req, res, next) =>{
      Room.findById(req.params.roomID)
      .then((room) =>{
          res.json(room);
      }).catch(next);
  })

  router
  .route("/:guestID/hotels/:hotelID/rooms/:roomID/book")
  .post((req, res, next) => {
    let { hotel, room, checkIn, checkOut, customer } = req.body;
      Reservation.create({
          hotel:req.params.hotelID,
          room:req.params.roomID,
          customer:req.params.guestID,
          checkIn,
          checkOut
      }).then((result) =>{
          Room.findById(req.params.roomID)
          .then((room) =>{
              Room.findByIdAndUpdate(req.params.roomID,
               {$set:{isReserved:true}},
               {new:true} )
               .then((updatedRoom) => {
                res.json(updatedRoom);
              })
              .catch(next);
          }).catch(next);
      }).catch(next);
  });

module.exports = router;
