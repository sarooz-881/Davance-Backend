const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    
     id:{
       type:String
     },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    contact:{
      type:String,
      required:true
    },

    email:{
      type:String,
      required:true
    },
    
    address:
      {
          country:{
              type:String
            },
        state: {
          type: String
        
        },
       street:{
           type:String
       },
      }
    ,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", profileSchema);
