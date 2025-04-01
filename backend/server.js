//backend/server.js

import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


const app = express();

//Connect to MongoDB
connectDB();

app.use(cors());
//Middleware to parse JSON
app.use(express.json({extended: false}));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 19000;
console.log("JWT Secret:", process.env.JWT_SECRET);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;

