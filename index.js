const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./router/userRouter');


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/ehotel/user',  userRouter);

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