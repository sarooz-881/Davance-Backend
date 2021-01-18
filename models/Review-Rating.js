const mongoose = require("mongoose");
const rrSchema = new mongoose.Schema ({ 

feedbacks:{
    type: String
},
rating:{
    type:Number,
    maxlength:1
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Guest",
    required:true
}

}, {timestamps:true})
module.exports = mongoose.model('Review-Rating', rrSchema);