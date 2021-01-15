const mongoose = require("mongoose");
const reservationSchema = new mongoose.Schema ({

    hotel :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },

    checkIn:{
        type: Date,
        required:true
    },
    
    checkOut:{
        type: Date,
        required:true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true,
      },
}, {timestamps: true}
);

module.exports = mongoose.model('Reservation', reservationSchema);