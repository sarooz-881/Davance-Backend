const request = require('supertest');
const express = require('express');
require('dotenv').config();
const auth = require('../router/Authorization');
const userRouter = require('../router/userRouter');
const guestRouter = require('../router/guestRouter');
const app = express();


app.use(express.json());
app.use('/users', userRouter);
app.use('/ehotel/guest', auth.verifyUser, guestRouter);

require('./setup');

describe('Test of User Route', () => {
    test('should be able to register a user', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash1',
                password: 'bikash1',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    })
    test('Password must contain alphabets and numbers to register a user', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash12',
                password: 'bikashii',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
    test('email must be in proper format to register a user', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash12388',
                password: 'bikashii2',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                email: 'fghjkjhg',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
    test('user name should be unique to register', () => {
        return request(app).post('/users/register')
            .send({

                username: 'bikash1',
                password: 'bikash1',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
    test('should not register user with short username', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bik',
                password: 'bikash'
            }).then((res) => {
                
                expect(res.statusCode).toBe(400);
                
            })
            
    })
    test('should not register user with short password', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash',
                password: 'ash'
            }).then((res) => {
                
                expect(res.statusCode).toBe(400);
                
            })
            
    })
    test('should not able to register user without password ', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash',
                password: ''
            }).then((res) => {
                
                expect(res.statusCode).toBe(400);
                
            })
            
    })
    test(' should not able to register without username', () => {
        return request(app).post('/users/register')
            .send({
                username:'',
                password: 'bikash134',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
    test('first name is required to register', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash122',
                password: 'bikash134',
                firstName: '',
                lastName: 'Dhakal',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(500);
            })
    })
    test('last name is required to register', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash122',
                password: 'bikash134',
                firstName: 'Bikash',
                lastName: '',
                email: 'bikash@gmail.com',
                role: 'guest'
            })
            .then((res) => {
                expect(res.statusCode).toBe(500);
            })
    })

    test('email is required to register', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash1',
                password: 'bikash134',
                firstName: 'bikash',
                lastName: 'Dhakal',
                email: ''
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
    test('should be able to login', () => {
        return request(app).post('/users/login')
            .send({
                username: 'bikash1',
                password: 'bikash1'
            }).then((res) => {


                token = res.body.token;
               userId = res.body._id;
                expect(res.statusCode).toBe(200);
                expect(res.body.token).not.toBe('undefined');
            })
    })

test('should not login user with without register username', () =>{
    return request(app).post('/users/login')
    .send({
        username:'bikash9999',
        password:'dhakal'

    }).then((res) => {
        
        expect(res.statusCode).toBe(401);
        expect(res.body.token).not.toBe('undefined');

    })

})
test('should not login user with without register username', () =>{
    return request(app).post('/users/login')
    .send({
        username:'bikash1',
        password:'dhaka000l'

    }).then((res) => {
        
        expect(res.statusCode).toBe(401);
        expect(res.body.token).not.toBe('undefined');

    })

})
})
