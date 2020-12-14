const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../router/userRouter');

const app = express();


app.use(express.json());
app.use('/users', userRouter);

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
    test('user name should be unique to register', () => {
        return request(app).post('/users/register')
            .send({
                username: 'bikash1',
                password: 'bikash134',
                firstName: 'Bikash',
                lastName: 'Dhakal',
                address: 'chitwan'
            })
            .then((res) => {
                expect(res.statusCode).toBe(400);
            })
    })
//     test('should not register user with short username', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bik',
//                 password: 'bikash'
//             }).then((res) => {
                
//                 expect(res.statusCode).toBe(400);
                
//             })
            
//     })
//     test('should not register user with short password', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash',
//                 password: 'ash'
//             }).then((res) => {
                
//                 expect(res.statusCode).toBe(400);
                
//             })
            
//     })
//     test('should not able to register user without password ', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash',
//                 password: ''
//             }).then((res) => {
                
//                 expect(res.statusCode).toBe(400);
                
//             })
            
//     })
//     test(' should not able to register without username', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username:'',
//                 password: 'bikash134',
//                 firstName: 'Bikash',
//                 lastName: 'Dhakal',
//                 address: 'chitwan'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('first name should be between 2 and 30 character to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash122',
//                 password: 'bikash134',
//                 firstName: 'B',
//                 lastName: 'Dhakal',
//                 address: 'chitwan'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('first name is required to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash1',
//                 password: 'bikash134',
//                 firstName: '',
//                 lastName: 'Dhakal',
//                 address: 'chitwan'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('last name should be between 2 and 30 character to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash122',
//                 password: 'bikash134',
//                 firstName: 'Bikash',
//                 lastName: 'D',
//                 address: 'chitwan'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('last name is required to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash1',
//                 password: 'bikash134',
//                 firstName: 'bikash',
//                 lastName: '',
//                 address: 'chitwan'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('address should be between 2 and 30 character to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash122',
//                 password: 'bikash134',
//                 firstName: 'Bikash',
//                 lastName: 'Dhakal',
//                 address: 'q'
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('address is required to register', () => {
//         return request(app).post('/users/register')
//             .send({
//                 username: 'bikash1',
//                 password: 'bikash134',
//                 firstName: 'bikash',
//                 lastName: 'Dhakal',
//                 address: ''
//             })
//             .then((res) => {
//                 expect(res.statusCode).toBe(400);
//             })
//     })
//     test('should be able to login', () => {
//         return request(app).post('/users/login')
//             .send({
//                 username: 'bikash1',
//                 password: 'bikash1'
//             }).then((res) => {


//                 token = res.body.token;
//                userId = res.body._id;
//                 expect(res.statusCode).toBe(200);
//                 expect(res.body.token).not.toBe('undefined');
//             })
//     })
// test('should not login user with without register username', () =>{
//     return request(app).post('/users/login')
//     .send({
//         username:'bikash2',
//         password:'bikash1'

//     }).then((res) => {
       
//         expect(res.statusCode).toBe(401);
//         expect(res.body.token).not.toBe('undefined');

//     })

// })
// test('should not login user with without register username', () =>{
//     return request(app).post('/users/login')
//     .send({
//         username:'bikash1',
//         password:'dhakal'

//     }).then((res) => {
        
//         expect(res.statusCode).toBe(401);
//         expect(res.body.token).not.toBe('undefined');

//     })

// })
// test('should be able to get all users', () => {
//     return request(app).get(`/admin/users`)
//         .then((res) => {
//             expect(res.statusCode).toBe(401);
//         })

// })

})
