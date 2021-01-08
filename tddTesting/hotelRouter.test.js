const request = require('supertest');
const express = require('express');
require('dotenv').config();
const auth = require('../router/Authorization');
const userRouter = require('../router/userRouter');
const hotelRouter = require ('../router/hotelRouter');
const app = express();


app.use(express.json());
app.use('/users', userRouter);
app.use('/hotel', auth.verifyUser, hotelRouter);
require('./setup');

let token;
let hotelID;
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
            address: [],
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
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should not be able to register hotel details', () => {
         return request(app).post('/Hotel')
         .set('authorization', token)
         .send({
            gallery: [],
            room: [],
            
            hotelName: "bikash53",
            contact: "1234567",
            email: "dhakalbikash0@gmail.com",
            description: "my hotel",
            address: [],
            services: [],
         })
         .then((res)=> {
             expect(res.statusCode).toBe(401);
         })
     })
     test('should be able to get donation details by id', () => {
        return request(app).get(`/hotel/${hotelID}`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })

    test('should be able to update donation details', ()=>{
        return request(app).put(`/hotel/${hotelID}`)
        .set('authorization', token)
        .send({
            gallery: [],
            room: [],
            
            hotelName: "bikash5y3",
            contact: "1234567",
            email: "dhakalbikash0@gmail.com",
            description: "my hotel",
            address: [],
            services: [],
        })

        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get donation details by id', () => {
        return request(app).get(`/hotel/${hotelID}/address`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should be able to register hotel details', () => {
        return request(app).post(`/hotel/${hotelID}/address`)
        .set('authorization', token)
        .send({
           street: 'ddd',
           country: 'kk',
           state:'ee'
        })
        .then((res)=> {
            expect(res.statusCode).toBe(201);
        })
    })
 })