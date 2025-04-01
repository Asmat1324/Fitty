import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import express from 'express';
dotenv.config();

function auth(req, res, next) {
    //get token from authorization header
    const authHeader = req.headers['Authorization'];

    //check if authHeader exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try{
        //Extract the token (remove 'Bearer ')
        const token = authHeader.split(' ')[1];

        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach the user payload to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
export default auth;