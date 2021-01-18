const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const auth = require("./Authorization");

router
  .route("/")
  .get((req, res, next) => {
    if (req.user.role == "hotelOwner") {
      Hotel.find({ owner: req.user.id })
        .then((hotel) => {
          res.json(hotel);
        })
        .catch(next);
    }
    Hotel.find({})
      .then((hotels) => {
        res.send(hotels);
      })
      .catch(next);
  })

  .post(auth.verifyUser, auth.verifyhotelOwner, (req, res, next) => {
    let { hotelName, contact, email, description, address:country,address:state,address:street, 
      hotelOwner:ownerName, hotelOwner:ownerEmail, hotelOwner:ownerContact } = req.body;
    Hotel.findOne({ owner: req.user.id })
      .then((hotel) => {
        if (hotel) {
          let err = new Error("Hotel already created!");
          err.status = 401;
          return next(err);
        }
        Hotel.create({
          address:country,address:state,address:street,
          hotelOwner:ownerName, hotelOwner:ownerEmail, hotelOwner:ownerContact,
          hotelName,
          contact,
          email,
          description,
          owner: req.user.id,
        })
          .then((hotel) => {
            res.status(201).json(hotel);
          })
          .catch(next);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    Hotel.deleteOne({ owner: req.user.id })
      .then((reply) => {
        res.json(reply);
      })
      .catch(next);
  });

router
  .route("/:hotelID")
  .get((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .populate("rooms")
      .then((hotel) => {
        if (hotel !== null) {
          res.json(hotel);
        } else {
          let err = new Error("File not found!");
          err.status = 404;
          next(err);
        }
      })
      .catch(next);
  })

  .put((req, res, next) => {
    Hotel.findByIdAndUpdate(
      req.params.hotelID,
      { $set: req.body },
      { new: true }
    )
      .then((updatedHotel) => {
        res.json(updatedHotel);
      })
      .catch(next);
  });

router
  .route("/:hotelID/address")
  .get((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .then((hotel) => {
        res.json(hotel.address);
      })
      .catch(next);
  })

  .post((req, res, next) => {
    let { country, state, street } = req.body;
    Hotel.findById(req.params.hotelID).then((hotel) => {
      hotel.address.push({ country, state, street });
      hotel
        .save()
        .then((updatedHotel) => {
          res.status(201).json(updatedHotel);
        })
        .catch(next);
    });
  })

  .delete((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .then((hotel) => {
        hotel.address = [];
        hotel
          .save()
          .then((updatedHotel) => {
            res.json(updatedHotel.address);
          })
          .catch(next);
      })
      .catch(next);
  });

router
  .route("/:hotelID/services")
  .get((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .then((hotel) => {
        res.json(hotel.services);
      })
      .catch(next);
  })

  .post((req, res, next) => {
    Hotel.findById(req.params.hotelID).then((hotel) => {
      hotel.services.push(req.body);
      hotel
        .save()
        .then((updatedHotel) => {
          res.status(201).json(updatedHotel);
        })
        .catch(next);
    });
  })

  .delete((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .then((hotel) => {
        hotel.services = [];
        hotel
          .save()
          .then((updatedHotel) => {
            res.json(updatedHotel.services);
          })
          .catch(next);
      })
      .catch(next);
  });
  router
  .route("/:hotelID/hotelOwner")
  .get((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .then((hotel) => {
        res.json(hotel.hotelOwner);
      })
      .catch(next);
  })

  .post((req, res, next) => {
    Hotel.findById(req.params.hotelID).then((hotel) => {
      hotel.hotelOwner.push(req.body);
      hotel
        .save()
        .then((updatedHotel) => {
          res.status(201).json(updatedHotel);
        })
        .catch(next);
    });
  });

router.patch("/:hotelID/hotelOwner/:ownerID", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelID);
    if (!hotel) {
      return res.status(404).send({ "Not found": "Hotel not found..." });
    }
    hotel.hotelOwner = req.body;
    await package.save();
    res.status(201).send(hotel);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/:hotelID/services/:serviceID", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelID);
    if (!hotel) {
      return res.status(404).send({ "Not found": "Hotel not found..." });
    }
    const ser = hotel.services.id(req.params.serviceID);
    if (!ser) {
      return res.status(400).send({ Error: "File not found" });
    }
    await ser.remove();
    hotel.save();
    res.status(200).send(hotel);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router
.route('/:hotelID/reservations')
.get((req,res,next) =>{
  Reservation.find({hotel:req.params.hotelID})
  .populate('room')
  .populate('customer')
  .then((reservations) =>{
    res.json(reservations);
  }).catch(next);
})

router
.route('/:hotelID/reservations/:resID')
.get((req,res,next) =>{
  Reservation.findById(req.params.resID)
  .populate('room')
  .populate('customer')
  .then((reservation) =>{
res.json(reservation);
  }).catch(next);
})

router
  .route("/:hotelID/rooms")
  .get((req, res, next) => {
    Hotel.findById(req.params.hotelID)
      .populate("rooms")
      .then((hotel) => {
        res.json(hotel.rooms);
      })
      .catch(next);
  })

  .post(auth.verifyhotelOwner, (req, res, next) => {
    let { room_no, roomType, image, price, isReserved, hotel } = req.body;
    Room.create({
      room_no,
      roomType,
      image,
      price,
      isReserved,
      hotel: req.params.hotelID,
      owner: req.user.id,
    })
      .then((room) => {
        Hotel.findById(req.params.hotelID)
          .then((hotel) => {
            hotel.rooms.push(room.id);
            hotel.save();
          })
          .catch(next);
        res.status(201).json(room);
      })
      .catch(next);
  });

router
  .route("/:hotelID/rooms/:roomID")
  .get((req, res, next) => {
    Room.findById(req.params.roomID)

      .then((room) => {
        if (room != null) {
          res.json(room);
        } else {
          let err = new Error("File not found!");
          err.status = 404;
          next(err);
        }
      })
      .catch(next);
  })

  .put((req, res, next) => {
    Room.findById(req.params.roomID)
      .then((room) => {
        Room.findByIdAndUpdate(
          req.params.roomID,
          { $set: req.body },
          { new: true }
        )
          .then((updatedRoom) => {
            res.json(updatedRoom);
          })
          .catch(next);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    Room.deleteOne({ _id: req.params.roomID })
      .then((reply) => {
        res.json(reply);
      })
      .catch(next);
  });

module.exports = router;
