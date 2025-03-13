//backend/server.js



import express from 'express';

import connectDB from './db.js';

import dotenv from 'dotenv';

import authRoutes from './auth.js';



dotenv.config();





const app = express();



//Connect to MongoDB

connectDB();



//Middleware to parse JSON

app.use(express.json({extended: false}));



//Define Routes

app.use('/api/auth', authRoutes);





app.get('/', (req, res) => res.send('API Running'));



const PORT = process.env.PORT || 19000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



export default app;

