//backend/middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import express from 'express';
dotenv.config();

export default function (req, res, next) {
    //get token from authorization header
    const token = req.header('x-auth-token');

    //check if token exists and starts with 'Bearer '
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //add user from payload to request
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}