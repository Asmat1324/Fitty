//backend/server.js
//0x534e474b4d56525044575448 \\c
//0x54485350524a434e44464d4c \\p
//0x4c5247434d504e53444b4648 \\a


import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
dotenv.config();


const app = express();

//Connect to MongoDB
connectDB();

//Middleware to parse JSON
app.use(express.json({ limit: '50mb'}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

//Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} = ${req.method} ${req.url}`);
    next();
});
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//ensure tempUploads dir exists
const tempUploadsDir = path.join(__dirname, 'tempUploads');
if (!fs.existsSync(tempUploadsDir)) {
    fs.mkdirSync(tempUploadsDir, { recursive: true });
    console.log('tempUploads directory created');
}

//Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

//root route
app.get('/', (req, res) => {
    res.send('API Running');
});

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        //error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

const PORT = process.env.PORT || 19000;
//console.log("Environment:", process.env.NODE_ENV);
console.log("JWT Secret:", process.env.JWT_SECRET);
//console.log("AWS S3 configured:", !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;

