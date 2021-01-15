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
let roomID;
let ownerID;
let resID;
let serviceID;
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
            address: [],
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
            address: [],
            services: [],
        })

        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get hotel address by id', () => {
        return request(app).get(`/hotel/${hotelID}/address`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should be able to post hotel address', () => {
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
    test('should be able to get hotel services by id', () => {
        return request(app).get(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('Should be able to post hotel address', () => {
        return request(app).post(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .send({
           services:''
        })
        .then((res)=> {
            serviceID = res.body_id
            console.log(res.body)
            
            expect(res.statusCode).toBe(201);
        })
    })
    test('hotel owner Should be able to post hotel', () => {
        return request(app).post(`/hotel/${hotelID}/hotelOwner`)
        .set('authorization', token)
        .send({
        })
        .then((res)=> {
            ownerID = res.body._id
            expect(res.statusCode).toBe(201);
        })
    })
    test('hotel owner should be able to get hotel ', () => {
        return request(app).get(`/hotel/${hotelID}/hotelOwner`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('hotel owner Should be able to post hotel', () => {
        return request(app).patch(`/hotel/${hotelID}/hotelOwner/${ownerID}`)
        .set('authorization', token)
        .send({
        })
        .then((res)=> {
         
            expect(res.statusCode).toBe(201);
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
            
            expect(res.statusCode).toBe(200);
        })
    })
    test('should be able to get reservations', () => {
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
            console.log(res)
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete hotel services by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/services`)
        .set('authorization', token)
        .then((res) => {
            
            expect(res.statusCode).toBe(200);
        })
    })
    test(' should able to delete hotel address by id', ()=> {
        return request(app).delete(`/hotel/${hotelID}/address`)
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
    test('should show the "file not found" message if there is no hotel details found', () => {
        return request(app).get(`/hotel/${hotelID}`)
        .set('authorization', token)
        .then((res)=>{
            
            expect(res.statusCode).toBe(404);
        })
    })
    test(' should show the "file not found" message if there is noroom details found', ()=> {
        return request(app).get(`/hotel/${hotelID}/rooms/${roomID}`)
        .set('authorization', token)
        .then((res) => {
            
            expect(res.statusCode).toBe(404);
        })
    })
 })