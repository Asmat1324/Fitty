//backend/server.js

const express = require('express');
const connectDB = require('./db');  
require('dotenv').config();


const app = express();

//Connect to MongoDB
connectDB();

//Middleware to parse JSON
app.use(express.json({extended: false}));

//Define Routes



app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 19000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));