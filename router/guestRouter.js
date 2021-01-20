const express = require("express");
const router = express.Router();
const Guest = require('../models/Guest');
const auth = require('./Authorization');
const validation = require("../validator/validator");
const Hotel = require("../models/Hotel");
const Reservation = require('../models/Reservation');
const Room = require("../models/Room");
const Feedback = require("../models/Review-Rating");
const { populate } = require("../models/Hotel");


router
  .route("/")
  .get((req, res, next) => {
    if (req.user.role === "guest") {
        Guest
        .findOne({ owner: req.user.id })
        .populate('reservation')
        .then((guest) => {
          if(guest.balance <= 2000)
          {
            Guest.findByIdAndUpdate(guest._id,
              {$set:{balance:5000}},
              {new:true})
              .then((updatedGuest)=>{
                res.json(updatedGuest);
              }).catch(next);
          }
          else{
          res.json(guest);
          }
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
      .populate('reservation')
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
  
  router
  .route("/:guestID/hotels")
  .get((req, res, next) => {
  Hotel.find()
  .populate("rooms")
  .populate('services')
  .populate('review_ratings')
    .then((hotels) => {
      res.json(hotels);
    })
    .catch(next);
})

router.route("/:guestID/hotels/:hotelID")
  .get((req, res, next) => {
  Hotel.findById(req.params.hotelID)
  .populate("rooms")
  .populate('services')
  .populate('review_ratings')
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
    Room.findById(req.params.roomID)
    .then((room)=>{
      if(room.isReserved == true)
      {
        let err = new Error ("Sorry! The room has been already reserved!");
        err.status=401;
        return next (err);
      }
   else{

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
               {$set:{isReserved:true, reservation:result._id}},
               {new:true} )
               .then((updatedRoom) => {
                Guest.findById(req.params.guestID)
                  .then((guest)=>{
                    guest.reservation.push(result._id);
                    guest.save();
                    const deductedPrice = guest.balance - room.price;
                    Guest.findByIdAndUpdate(req.params.guestID,
                      {$set:{balance:deductedPrice}},
                      {new:true})
                      .then((updatedGuest)=>{}).catch(next);
                  }).catch(next);
                res.json(updatedRoom);
             
              })
              .catch(next);
          }).catch(next);
         
      }).catch(next);
    }
    }).catch(next);
  });

  router
  .route("/:guestID/hotels/:hotelID/feedback")
.get((req,res,next) =>{
  Feedback.find()
  .then((feedbacks) =>{
    res.json(feedbacks);
  }).catch(next);
})

.post(auth.verifyGuest, (req,res,next) =>{
let {feedbacks , rating} = req.body;
  Feedback.create({feedbacks, rating, owner : req.params.guestID} )
  .then((feedback) =>{
    Hotel.findById(req.params.hotelID)
    .then((hotel)=>{
      hotel.review_ratings.push(feedback._id)
      hotel.save();
    }).catch(next);
    res.status(201).json(feedback);
  }).catch(next);
})

router
.route("/:guestID/hotels/:hotelID/feedback/:feedbackID")
.get((req, res, next) =>{
  Feedback.findById(req.params.feedbackID)
  .then((feedback) =>{
    res.json(feedbacks);
  }).catch(next);
})

.put((req,res,next) =>{
  Feedback.findByIdAndUpdate(
    {owner:req.params.guestID},
    { $set: req.body },
    { new: true }
  ).then((updatedFeedback) =>{
    res.json(updatedFeedback);
  }).catch(next);

})

.delete((req,res,next) =>{
  Feedback.deleteOne({owner:req.params.guestID})
  .then(reply =>{
    Hotel.findById(req.params.hotelID)
    .then((hotel) =>{
      hotel.review_ratings = hotel.review_ratings.filter((rr)=>{
        return rr._id != req.params.feedbackID;
      });
      hotel.save();
    }).catch(next);
    res.json(reply);
  }).catch(next);
})

  router
  .route("/:guestID/reservations")
  .get((req,res,next) => {
  Guest.findById(req.params.guestID)
  .populate("reservation")
  .populate('hotel')
  .populate('room')
  .then((guest) => {
    res.json(guest.reservation);
  }).catch(next);
  })

  router
  .route("/:guestID/reservations/:resID")
  .get((req, res, next) =>{
    Reservation.findById(req.params.resID)
   .populate('hotel')
   .populate('room')
    .then((reservation)=>{
      res.json(reservation);
    }).catch(next);
  })

  router
  .route("/:guestID/reservations/:resID/cancelBooking")
  .delete((req, res, next) =>{
    Reservation.deleteOne({_id:req.params.resID})
    .then((result) =>{
      Room.findOne({reservation:req.params.resID})
      .then((room) =>{
        Room.findByIdAndUpdate(room._id,
          {$set:{isReserved:false, reservation:null}},
          {new:true})
          .then((updatedRoom) =>{
            Guest.findById(req.params.guestID)
            .then((guest)=>{
              const balance = parseInt(guest.balance);
              const price = parseInt(room.price);
              const actualBalance = balance + price;
              Guest.findByIdAndUpdate(req.params.guestID,
                {$set:{balance:actualBalance}},
                {new:true})
                .then((updatedGuest)=>{}).catch(next);
            }).catch(next);
            res.json("Cancelation Successful!");
          }).catch(next);
        
      }).catch(next);
    }).catch(next);
  })
module.exports = router;
