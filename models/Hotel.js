const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema ({

    hotelName :{
        type:String,
        required: true
    
    },

    address: [{
        country:{type:String,required:true}, 
        state:{type:String,required:true}, 
        street:{type:String,required:true}
    }],

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
            required:false}
    }],
   room:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Room",
required:true
   }],

      owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
              },
}, {timestamps: true});
module.exports = mongoose.model('Hotel', hotelSchema);