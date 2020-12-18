const mongoose = require("mongoose");


const hotelSchema = new mongoose.Schema ({

    hotelName :{
        type:String,
        required: true
    
    },

    address: {country:{type:String,required:true}, state:{type:String,required:true}, street:{type:String,required:true}},

    description:{
        type: String,
        required: true
    },
    
    contact:{
        type: String,
        required:true
    },

 gallery:[
     {type:String,
    required:false}
 ],

   email: {
        type: String,
        required : true
    },

    services:[{
        serviceType:{
            type:String,
            required:false
        }
    }],
    room:[{
        room_no:{
            type:String,
            required:true
        },
        
        roomType:{
            type:String,
            required:true
        },

        image:{
          type:String,
          required:false
        },

        price:{
            type:String,
            required:true
        },
        total_no:{
            type:Number,
            required:true
        },
        available_no:{
            type:Number,
            required:true
        }
    }],
      owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
              },
}, {timestamps: true});
module.exports = mongoose.model('Hotel', hotelSchema);