const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema ({

    hotelName :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    checkIn:{
        type: date,
        required:true
    },
    checkOut:{
        type: date,
        required:true
    },
}, {timestamps: true});
module.exports = mongoose.model('Reservaton', reservationSchema);