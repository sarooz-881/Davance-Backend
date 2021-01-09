const request = require('supertest');
const express = require('express');
require('dotenv').config();
const auth = require('../router/Authorization');
const userRouter = require('../router/userRouter');
const guestRouter = require ('../router/guestRouter');
const app = express();


app.use(express.json());
app.use('/users', userRouter);
app.use('/ehotel/guest', auth.verifyUser, guestRouter);
require('./setup');

let token;
let hotelID;
let roomID;
let guestID;
beforeAll(() => {
    return request(app).post('/users/register')
        .send({
            username: 'test13456',
            password: 'bikash134',
            firstName: 'Dhakal',
            lastName: 'Bikash',
            email: 'bikash@gmail.com',
            role: 'guest'
            

        })
        .then((res) => {
            return request(app).post('/users/login')
                .send({
                    username: 'test13456',
                    password: 'bikash134'
                }).then((res) => {
    
                    expect(res.statusCode).toBe(200);
                    token = res.body.token;
                })
        })
})

describe('Guest router test', ()=> {
    test('Should be able to register guest details', () => {
        return request(app).post('/ehotel/guest')
        .set('authorization', token)
        .send({
            address:'',
            firstName:'Bikash',
            lastName:'Dhakal',
            image:'',
            gender:'male',
            contact:'9860196032',
            email:'dhakalbikash0@gmail.com',
            citizen_id:'464777',
            balance:'3000'
        })
        .then((res)=> {
            
            guestID = res.body._id
            expect(res.statusCode).toBe(201);
        })
    })
    test('should be able to get guest', ()=> {
       return request (app).get('/ehotel/guest')
       .set('authorization', token)
       .then((res)=> {
           
           expect(res.statusCode).toBe(200);
       })
   })
   test('should be able to get guest detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}`)
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get guest detail by id', ()=> {
    return request (app).put(`/ehotel/guest/${guestID}`)
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get guest detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels`)
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get guest detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}`)
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
})