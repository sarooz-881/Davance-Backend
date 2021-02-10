const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./router/userRouter');
const guestRouter = require('./router/guestRouter');
const hotelRouter = require('./router/hotelRouter');
const uploadImage = require('./router/UploadImage');
const path = require('path');
const auth = require('./router/Authorization');
const cors = require('cors')


app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/ehotel/user',  userRouter);
app.use('/ehotel/hotel',  hotelRouter);
app.use('/ehotel/guest', auth.verifyUser, guestRouter);
app.use('/ehotel/hotel/upload/image',uploadImage);
app.use(express.static(path.join(__dirname,'gallery')));

mongoose.connect(process.env.DbURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true})
    .then(()=>{
        console.log('Connected to our database server');
    });
    app.get('/',(req,res)=>{
        res.send("Welcome to E-Hotel Reservation System");
    });

    app.listen(process.env.Port, ()=>{
        console.log(`Server is running at localhost:${process.env.Port}`);
    });