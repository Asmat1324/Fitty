// backend/test/auth.test.js
import request from 'supertest';
import app from '../server.js';
import { expect } from 'chai';
import User from '../models/user.js';

/**
 * @description Group related tests for the Authentication Routes
 */
describe('Auth Routes', () => {
    //Clean up the db before each test
    beforeEach(async () => {
        await User.deleteMany();
    });
    //Test for successful user registration
    it ('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Test',
                lastname: 'User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.status).to.equal(201); //assert it should respond 201 (created)
            expect(res.body).to.have.property('msg'); 
            expect(res.body.msg).to.equal('User registered successfully'); //assert it should respond with the correct message
    });
    
    //Test for successful user login
    it ('should login a user', async () => {
        //Register a user
        await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Test',
                lastname: 'User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        //Login the user
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
            expect(res.status).to.equal(200); //asserting that the response is 200 (OK)
            expect(res.body).to.have.property('token'); //asserting that the response contains a token
    });
    //Test for sucessful user login with email
    it ('should login a user with email', async () => {
        //Register a user
        await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Test',
                lastname: 'User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            //Login the user with email
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
               // console.log(res.body);
                expect(res.status).to.equal(200); //asserting that the response is 200 (OK)
                expect(res.body).to.have.property('token'); //asserting that the response contains a token
    });
    //Test for unsuccessful login due to incorrect password
    it ('should not login and return 400 for incorrect password', async () => {
        //Register a user
        await request(app)
            .post('/api/auth/register')
            .send({
                firstname: 'Test',
                lastname: 'User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            //Attempt to login with incorrect password
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });
                expect(res.status).to.equal(400); //asserting that the response is 400 (Bad Request)
                expect(res.body.msg).to.equal('Invalid Credentials'); //asserting that the response contains the correct error message
            });
            //Test for unsuccessful login due to non-existent user
            it('should not login and return 400 for non-existent user', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: 'nonexistentuser',
                        password: 'somepassword'
                    });
                    expect(res.status).to.equal(400); //asserting that the response is 400 (Bad Request)
                    expect(res.body.msg).to.equal('Invalid Credentials'); //asserting that the response contains the correct error message
            });
        });