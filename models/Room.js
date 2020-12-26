const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    room_no: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: true,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);
