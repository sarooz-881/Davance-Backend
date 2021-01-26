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
app.use('/hotel', auth.verifyUser, hotelRouter);
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
                            expect(res.statusCode).toBe(200);
                            token1 = res.body.token;
                    return request(app).post('/ehotel/guest')
                        .set('authorization', token1)
                        .send({
                            address:'',
                            firstName:'Bikash2',
                            lastName:'Dhakal',
                            image:'',
                            gender:'male',
                            contact:'9860196032',
                            email:'dhakalbikash0@gmail.com',
                            citizen_id:'464777',
                            balance:'3000'
                        })
                        .then((res)=>{
                            
                            guestID = res.body._id
                            expect(res.statusCode).toBe(201);
                        })
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
     
    test('should be able to get hotel', ()=> {
        return request (app).get('/Hotel')
        .set('authorization', token)
        .then((res)=> {
            console.log(res.body)
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should not be able to register hotel twice', () => {
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
             expect(res.statusCode).toBe(401);
         })
     })
     test('should be able to get hotel details by id', () => {
        return request(app).get(`/hotel/${hotelID}`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })

    test('should be able to update hotel details', ()=>{
        return request(app).put(`/hotel/${hotelID}`)
        .set('authorization', token)
        .send({
            gallery: [],
            room: [],
            
            hotelName: "bikash5y3",
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

        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    
    test('Should be able to post hotel services', () => {
        return request(app).post(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .send({
           services:''
        })
        .then((res)=> {
            
            expect(res.statusCode).toBe(201);
        })
    })
    test('should be able to get hotel services by id', () => {
        return request(app).get(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .then((res)=>{
            console.log(res.body)
            serviceID = res.body[0]._id
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get hotel roomss by id', () => {
        return request(app).get(`/hotel/${hotelID}/rooms`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should be able to post hotel rooms', () => {
        return request(app).post(`/hotel/${hotelID}/rooms`)
        .set('authorization', token)
        .send({
            room_no: '2',
            roomType:'Basic',
            image: '',
            price:'1000',
            isReserved:'false'
        })
        .then((res)=> {
            roomID = res.body._id
            expect(res.statusCode).toBe(201);
        })
    })
    test('should be able to get hotel rooms by room id', () => {
        return request(app).get(`/hotel/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to update room details by id', ()=>{
        return request(app).put(`/hotel/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .send({
        })

        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get reservations', () => {
        return request(app).get(`/hotel/${hotelID}/reservations`)
        .set('authorization', token)
        .then((res)=>{
            resID = res.body._id
            console.log(res.body)
            expect(res.statusCode).toBe(200);
        })
    })
    test('guest should be able to get room detail by id', ()=> {
        return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .then((res)=> {
            expect(res.statusCode).toBe(200);
        })
    })
    test('Guest should be able to book room', ()=> {
        return request (app).post(`/ehotel/guest/${guestID}/hotels/${hotelID}/rooms/${roomID}/book`)
        .set('authorization', token)
        .send({
            checkIn:'2020/2/3',
            checkOut:'2020/2/4'
        })
        .then((res)=> {
            resID = res.body._id
            expect(res.statusCode).toBe(200);
        })
    })
    
    test('should be able to get reservations by id', () => {
        return request(app).get(`/hotel/${hotelID}/reservations/${resID}`)
        .set('authorization', token)
        .then((res)=>{ 
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete room by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .then((res) => {
            
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services/${serviceID}`)
        .set('authorization', token)
        .then((res) => {
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services/${serviceID}`)
        .set('authorization', token)
        .then((res) => {
            expect(res.statusCode).toBe(400);
        })
    })
   

    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .then((res) => {
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to delete hotel', ()=> {
        return request (app).delete('/Hotel')
        .set('authorization', token)
        .then((res)=> {
            
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services/${serviceID}`)
        .set('authorization', token)
        .then((res) => {
            expect(res.statusCode).toBe(404);
        })
    })
    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services/${serviceID}`)
        .set('authorization', token)
        .then((res) => {
            expect(res.statusCode).toBe(404);
        })
    })
    test(' "Not found": "Hotel not found..."  message Should show if there is no hotel ', () => {
        return request(app).patch(`/hotel/${hotelID}/hotelOwner/${ownerID}`)
        .set('authorization', token)
        .send({
        })
        .then((res)=> {
         
            expect(res.statusCode).toBe(404);
        })
    })
    test('should show the "file not found" message if there is no hotel details found', () => {
        return request(app).get(`/hotel/${hotelID}`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(404);
        })
    })
    test(' should show the "file not found" message if there is no room details found', ()=> {
        return request(app).get(`/hotel/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .then((res) => {
            
            expect(res.statusCode).toBe(404);
        })
    })
  })
