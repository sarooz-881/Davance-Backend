const request = require('supertest');
const express = require('express');
require('dotenv').config();
const auth = require('../router/Authorization');
const userRouter = require('../router/userRouter');
const hotelRouter = require ('../router/hotelRouter');
const app = express();
const guestRouter = require('../router/guestRouter');

app.use(express.json());
app.use('/users', userRouter);
app.use('/hotel',  hotelRouter);
app.use('/ehotel/guest', auth.verifyUser, guestRouter);
require('./setup');


let token;
let token1;
let hotelID;
let roomID;
let ownerID;
let resID;
let serviceID;
let guestID;
beforeAll(() => {
    return request(app).post('/users/register')
        .send({
            username: 'test1345',
            password: 'bikash134',
            firstName: 'Dhakal',
            lastName: 'Bikash',
            email: 'bikash@gmail.com',
            role: 'hotelOwner'
            

        })
        .then((res) => {
            return request(app).post('/users/login')
                .send({
                    username: 'test1345',
                    password: 'bikash134'
                }).then((res) => {
    
                    expect(res.statusCode).toBe(200);
                    token = res.body.token;

                    return request(app).post('/users/register')
                    .send({
                        username: 'test1345678',
                        password: 'bikash134',
                        firstName: 'Dhakal',
                        lastName: 'Bikash',
                        email: 'bikash@gmail.com',
                        role: 'guest'  
                    })
                    .then((res) => {
                        return request(app).post('/users/login')
                        .send({
                            username: 'test1345678',
                            password: 'bikash134'
                        }).then((res)=> {
                           
                            token1 = res.body.token;
                      expect(res.statusCode).toBe(200);
                    
                        })
                    })
                })
        })
})
 describe('Hotel router test', ()=> {
     test('Should be able to register hotel details', () => {
         return request(app).post('/Hotel')
         .set('authorization', token)
         .send({
            gallery: [],
            room: [],
            
            hotelName: "bikash53",
            contact: "1234567",
            email: "dhakalbikash0@gmail.com",
            description: "my hotel",
            address: {
                street: "4200",
                state:"3",
                country:"nepal"
            },
            services: [],
         })
         .then((res)=> {
        
             hotelID = res.body._id
             
             expect(res.statusCode).toBe(201);
         })
     })
     
    
    test('should be able to get hotel list ', ()=> {
        return request (app).get('/Hotel/hotelList')
        .then((res)=> {
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get hotel details by id', () => {
        return request(app).get(`/Hotel/hotelList/${hotelID}`)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get hotel loation in map details by id', () => {
        return request(app).patch(`/Hotel/geoLocation/${hotelID}`)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get hotel details by id', () => {
        return request(app).patch(`/Hotel/geoLocation/${hotelID}`)
        .send({
            latitude: [],
            longitude: [],

         })
        .then((res)=>{
            
            expect(res.statusCode).toBe(400);
        })
    })
   
    })
  