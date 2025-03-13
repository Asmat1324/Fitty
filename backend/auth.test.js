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

                username: 'testuser',

                email: 'test@example.com',

                password: 'password123'

            });



            expect(res.status).to.equal(200); //asserting that the response is 200 (OK)

            expect(res.body).to.have.property('token'); //asserting that the response contains a token

    });



    //Test for unsuccessful user registration due to duplicate username

    it ('should not register a user with an existing username', async () => {

        //Register a user

        await request(app)

            .post('/api/auth/register')

            .send({

                username: 'testuser',

                email: 'test@example.com',

                password: 'password123'

            });

            //Attempt to register a user with the same username

            const res = await request(app)

                .post('/api/auth/register')

                .send({

                    username: 'testuser',

                    email: 'another@example.com',

                    password: 'anotherpassword'

                });



                console.log(res.body);



                expect(res.status).to.equal(400); //asserting that the response is 400 (Bad Request)

                expect(res.body).to.have.property('msg'); //asserting that the response contains an error message

                expect(res.body.msg).to.equal('Username already exists'); //asserting that the response contains the correct

    });



    //Test for successful user login

    it ('should login a user', async () => {

        //Register a user

        await request(app)

            .post('/api/auth/register')

            .send({

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



                console.log(res.body);



                expect(res.status).to.equal(200); //asserting that the response is 200 (OK)

                expect(res.body).to.have.property('token'); //asserting that the response contains a token

    });



    //Test for unsuccessful login due to incorrect password

    it ('should not login and return 400 for incorrect password', async () => {

        //Register a user

        await request(app)

            .post('/api/auth/register')

            .send({

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