const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({

    username :{
        type:String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength:20
    },
     password: {
         type:String,
         required:true,
         minlength:6
     },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required:true
    },
 
   email: {
        type: String,
        required : true
    },

    role: {
        type:String,
        default:'guest',
        enum:['guest' , 'admin','employee']
            },

}, {timestamps: true});
module.exports = mongoose.model('User', userSchema);