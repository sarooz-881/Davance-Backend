const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
  {
    citizen_id: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    contact: {
      type: String,
      required: true,
    },

    address: {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      street: {
        type: String,
      },
    },
    age : {
      type: Number,
      required: true,
      maxlength: 3
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guestImage : {
      type: Buffer
    },
    Balance : {
      type: Number,
      maxlength: 10,
      default: 5000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", profileSchema);
