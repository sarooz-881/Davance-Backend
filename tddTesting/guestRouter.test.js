const request = require('supertest');
const express = require('express');
require('dotenv').config();
const auth = require('../router/Authorization');
const userRouter = require('../router/userRouter');
const guestRouter = require ('../router/guestRouter');
const hotelRouter = require ('../router/hotelRouter');
const app = express();


app.use(express.json());
app.use('/users', userRouter);
app.use('/ehotel/guest', auth.verifyUser, guestRouter);
app.use('/hotel', auth.verifyUser, hotelRouter);
require('./setup');

let token;
let token1;
let hotelID;
let hotelID1
let roomID;
let guestID;
let resID;
let feedbackID;
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
        
            return request(app).post('/users/register')
            .send({
                username: 'test134567',
                password: 'bikash134',
                firstName: 'Dhakal',
                lastName: 'Bikash',
                email: 'bikash@gmail.com',
                role: 'hotelOwner'  
            })
            .then((res) => {
                return request(app).post('/users/login')
                    .send({
                        username: 'test134567',
                        password: 'bikash134'
                    }).then((res) => {
                        expect(res.statusCode).toBe(200);
                        token1 = res.body.token;
                    return request(app).post('/Hotel')
                        .set('authorization', token1)
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
                            hotelID1 = res.body._id
                            expect(res.statusCode).toBe(201);

                        return request(app).post(`/Hotel/${hotelID1}/rooms`)
                        .set('authorization', token1)
                        .send({
                            room_no:"303",
                            roomType:"Normal",
                            price: "500"
                        })
                        .then((res)=> {
                            
                            expect(res.statusCode).toBe(201);
                        })  
                        })  

                    
                        
                    })

            })
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
    test('should be required to get guest', ()=> {
        return request (app).get('/ehotel/guest')
        .then((res)=> {
            
            expect(res.statusCode).toBe(401);
        })
    })
    test('should be required to get guest', ()=> {
        return request (app).get('/ehotel/guest')
        .then((res)=> {
            
            expect(res.statusCode).toBe(401);
        })
    })
    test('should be able to get guest', ()=> {
       return request (app).get('/ehotel/guest')
       .set('authorization', token)
       .then((res)=> {
           
           expect(res.statusCode).toBe(200);
       })
   })
   test('unauthorize user should not be able to get guest list', ()=> {
    return request (app).get('/ehotel/guest')
    .set('authorization', token1)
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
test('should be able to update guest detail by id', ()=> {
    return request (app).put(`/ehotel/guest/${guestID}`)
    .set('authorization', token)
    .send({
        
        firstName:'Bikash',
        lastName:'Dhakal',
        image:'',
        gender:'male',
        contact:'9860196032',
        email:'dhakalbikash0@gmail.com',
        citizen_id:'464777',
        balance:'1500'
    })
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get guest detail by id', ()=> {
    return request (app).get('/ehotel/guest')
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get hotels ', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels`)
    .set('authorization', token)
    .then((res)=> {
        hotelID = res.body[0]._id
        expect(res.statusCode).toBe(200);
    })
})
test('should be able to get hotels detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}`)
    .set('authorization', token)
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('guest should be able to get hotel available rooms ', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}/rooms`)
    .set('authorization', token)
    .then((res)=> {
        roomID = res.body[0]._id
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
        expect(res.statusCode).toBe(200);
    })
})
test('"Sorry! The room has been already reserved!" message should be shown if room is already booked', ()=> {
    return request (app).post(`/ehotel/guest/${guestID}/hotels/${hotelID}/rooms/${roomID}/book`)
    .set('authorization', token)
    .send({
        checkIn:'2020/2/3',
        checkOut:'2020/2/4'
    })
    .then((res)=> {
        expect(res.statusCode).toBe(401);
    })
})
test('guest should be able to get reservation detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/reservations`)
    .set('authorization', token)
    .then((res)=> {
        resID = res.body[0]._id
        expect(res.statusCode).toBe(200);
    })
})

test('guest should be able to get reservation detail by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/reservations/${resID}`)
    .set('authorization', token)
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('Guest should be able to post feedback', ()=> {
    return request (app).post(`/ehotel/guest/${guestID}/hotels/${hotelID}/feedback`)
    .set('authorization', token)
    .send({
        feedback:'good hospitality',
        rating:'4'
    })
    .then((res)=> {
        feedbackID = res.body._id
        expect(res.statusCode).toBe(201);
    })
})
test('guest should be able to get feedback', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}/feedback`)
    .set('authorization', token)
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('guest should be able to get feedback by id', ()=> {
    return request (app).get(`/ehotel/guest/${guestID}/hotels/${hotelID}/feedback/${feedbackID}`)
    .set('authorization', token)
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('guest should be able to update feedback by id', ()=> {
    return request (app).put(`/ehotel/guest/${guestID}/hotels/${hotelID}/feedback/${feedbackID}`)
    .set('authorization', token)
    .send({
        feedback:'good hospitality',
        rating:'3'
    })
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('guest should be able to delete feedback by id', ()=> {
    return request (app).delete(`/ehotel/guest/${guestID}/hotels/${hotelID}/feedback/${feedbackID}`)
    .set('authorization', token)
    
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})
test('guest should be able to cancel booking', ()=> {
    return request (app).delete(`/ehotel/guest/${guestID}/reservations/${resID}/cancelBooking`)
    .set('authorization', token)
    .then((res)=> {
        expect(res.statusCode).toBe(200);
    })
})

test('Should not be able to register guest more than once', () => {
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
        expect(res.statusCode).toBe(401);
    })
})
test('should be able to delete guest', ()=> {
    return request (app).delete('/ehotel/guest')
    .set('authorization', token)
    .then((res)=> {
        
        expect(res.statusCode).toBe(200);
    })
})

})